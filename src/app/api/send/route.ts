import { Resend } from "resend";
import { NextResponse } from "next/server";
import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

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

export async function POST(request: Request) {
  const { name, email, message, token } = await request.json();

  if (!name || !email || !message || !token) {
    return NextResponse.json(
      { error: "Name, email, message, and token are required" },
      { status: 400 }
    );
  }

  // Initialize Resend only when needed
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }
  
  const resend = new Resend(process.env.RESEND_API_KEY);

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

    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: "davide@areias.it",
      subject: "New Message from Portfolio Contact Form",
      html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p><p>reCAPTCHA Score: ${score}</p>`,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("reCAPTCHA assessment error:", error);
    return NextResponse.json(
      { error: "Could not verify reCAPTCHA. Please try again later." },
      { status: 500 }
    );
  }
}
