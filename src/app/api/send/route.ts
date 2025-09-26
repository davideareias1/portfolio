import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import { applyRateLimit } from "@/lib/rateLimit";
import { isSameOrigin, sanitizePlainText } from "@/lib/security";

const resend = new Resend(process.env.RESEND_API_KEY);
const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!recaptchaSecretKey) {
    throw new Error("RECAPTCHA_SECRET_KEY environment variable not set");
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: recaptchaSecretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().min(3).max(200).email(),
  message: z.string().min(1).max(5000),
  token: z.string().min(1),
})

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const rl = applyRateLimit({ request, limit: 5, windowMs: 60_000, identifier: 'contact:post' })
  if (!rl.allowed) {
    return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), { status: 429, headers: rl.headers })
  }

  const body = await request.json();
  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 })
  }
  const { name, email, message, token } = parsed.data;

  if (!name || !email || !message || !token) {
    return NextResponse.json(
      { error: "Name, email, message, and token are required" },
      { status: 400 }
    );
  }

  try {
    const isValidRecaptcha = await verifyRecaptcha(token);

    if (!isValidRecaptcha) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed. Please try again." },
        { status: 400 }
      );
    }

    const safeName = sanitizePlainText(String(name)).slice(0, 200)
    const safeEmail = sanitizePlainText(String(email)).slice(0, 200)
    const safeMessage = sanitizePlainText(String(message)).slice(0, 5000)

    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: "davide@areias.it",
      subject: "New Message from Portfolio Contact Form",
      html: `<p>Name: ${safeName}</p><p>Email: ${safeEmail}</p><p>Message: ${safeMessage}</p>`,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return new NextResponse(JSON.stringify(data), { status: 200, headers: rl.headers });
  } catch (error) {
    console.error("reCAPTCHA assessment error:", error);
    return NextResponse.json(
      { error: "Could not verify reCAPTCHA. Please try again later." },
      { status: 500 }
    );
  }
}
