"use client";
import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import ContactForm from "./ContactForm";

const Contact = () => {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <section id="contact" className="h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 flex items-center relative z-30">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Let&apos;s Connect</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            Have a question or want to work together? Send me a message.
          </p>
          <p className="text-2xl text-gray-200">
            <a 
              href="mailto:davide@areias.it" 
              className="text-[color:var(--color-primary)] hover:text-[color:var(--color-primary-hover)] transition-colors"
            >
              davide@areias.it
            </a>
          </p>
        </div>
        {recaptchaKey ? (
          <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
            <ContactForm />
          </GoogleReCaptchaProvider>
        ) : (
          <div className="mt-8 text-center">
            <p className="text-red-400 bg-red-900/20 border border-red-400/30 rounded-lg p-4 max-w-2xl mx-auto">
              reCAPTCHA is not configured. Please add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to your environment variables.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
