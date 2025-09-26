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
        <div className="mt-6 sm:mt-8 text-center">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 max-w-md mx-auto">
            <p className="text-lg text-green-400 font-medium">
              Thank you! Your message has been sent.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto mt-6 sm:mt-8 max-w-xl px-4 sm:px-0">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full rounded-lg border border-gray-700 bg-white/5 backdrop-blur-sm p-3 sm:p-4 text-sm sm:text-base text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
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
                className="w-full rounded-lg border border-gray-700 bg-white/5 backdrop-blur-sm p-3 sm:p-4 text-sm sm:text-base text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                rows={5}
                className="w-full rounded-lg border border-gray-700 bg-white/5 backdrop-blur-sm p-3 sm:p-4 text-sm sm:text-base text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors resize-none"
              ></textarea>
              {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
            </div>
            {submitError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-sm text-red-400">{submitError}</p>
              </div>
            )}
            <button
              type="submit"
              className="rounded-lg bg-blue-500 hover:bg-blue-600 px-6 py-3 sm:py-4 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
            >
              {isSubmitting ? "Submitting..." : "Send Message"}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default ContactForm; 