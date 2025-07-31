"use client";
import React, { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const ContactForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const tempErrors = { name: "", email: "", message: "" };
    let isValid = true;
    if (!formData.name) {
      tempErrors.name = "Name is required";
      isValid = false;
    }
    if (!formData.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
      isValid = false;
    }
    if (!formData.message) {
      tempErrors.message = "Message is required";
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!executeRecaptcha) {
      setSubmitError("reCAPTCHA not loaded. Please try again.");
      return;
    }
    if (validate()) {
      setIsSubmitting(true);
      setSubmitError("");
      try {
        const token = await executeRecaptcha("contactForm");

        const res = await fetch("/api/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, token }),
        });

        if (res.ok) {
          setIsSubmitted(true);
        } else {
          const data = await res.json();
          setSubmitError(data.error || "Something went wrong. Please try again.");
        }
      } catch {
        setSubmitError("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      {isSubmitted ? (
        <div className="mt-8 text-center text-lg text-green-500">
          Thank you! Your message has been sent.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full rounded-lg border-gray-700 bg-white/5 p-3 text-sm text-white"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full rounded-lg border-gray-700 bg-white/5 p-3 text-sm text-white"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                rows={6}
                className="w-full rounded-lg border-gray-700 bg-white/5 p-3 text-sm text-white"
              ></textarea>
              {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
            </div>
            {submitError && <p className="mt-1 text-xs text-red-500">{submitError}</p>}
            <button
              type="submit"
              className="rounded-lg bg-[color:var(--color-primary)] px-5 py-3 text-white transition hover:bg-[color:var(--color-primary-hover)] disabled:opacity-50"
              disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default ContactForm; 