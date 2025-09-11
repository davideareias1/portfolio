import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import { applyRateLimit } from "@/lib/rateLimit";
import { isSameOrigin, sanitizePlainText } from "@/lib/security";

const resend = new Resend(process.env.RESEND_API_KEY);
const projectID = process.env.RECAPTCHA_PROJECT_ID;
const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

async function createAssessment({
  token,
  recaptchaAction,
}: {
  token: string;
  recaptchaAction: string;
}) {
  if (!projectID || !recaptchaKey) {
    throw new Error("reCAPTCHA environment variables not set");
  }
  const client = new RecaptchaEnterpriseServiceClient();
  const projectPath = client.projectPath(projectID);

  const request = {
    assessment: {
      event: {
        token: token,
        siteKey: recaptchaKey,
      },
    },
    parent: projectPath,
  };

  const [response] = await client.createAssessment(request);

  if (!response.tokenProperties?.valid) {
    console.log(
      `The CreateAssessment call failed because the token was: ${response.tokenProperties?.invalidReason}`
    );
    return null;
  }

  if (response.tokenProperties.action === recaptchaAction) {
    console.log(`The reCAPTCHA score is: ${response.riskAnalysis?.score}`);
    response.riskAnalysis?.reasons?.forEach((reason) => {
      console.log(reason);
    });
    return response.riskAnalysis?.score ?? null;
  } else {
    console.log(
      "The action attribute in your reCAPTCHA tag does not match the action you are expecting to score"
    );
    return null;
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
    const score = await createAssessment({
      token,
      recaptchaAction: "contactForm",
    });

    if (score === null || score < 0.5) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed. Bot-like behavior detected." },
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
      html: `<p>Name: ${safeName}</p><p>Email: ${safeEmail}</p><p>Message: ${safeMessage}</p><p>reCAPTCHA Score: ${score}</p>`,
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
