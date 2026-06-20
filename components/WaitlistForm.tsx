"use client";

import { useState, FormEvent } from "react";
import { Section } from "./ui/Section";
import { Button } from "./ui/Button";

const PROPERTY_TYPES = [
  "Primary home",
  "Second home",
  "Rental",
  "Builder/developer",
  "Contractor",
  "Other",
] as const;

type FormStatus = "idle" | "loading" | "success" | "error";

export function WaitlistForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const formId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    if (!formId) {
      setStatus("error");
      setErrorMessage(
        "Form is not configured yet. Please set NEXT_PUBLIC_FORMSPREE_ID in your environment."
      );
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        const result = await response.json();
        setStatus("error");
        setErrorMessage(
          result.error || "Something went wrong. Please try again."
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <Section id="waitlist" topo>
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-teal mb-3">
            Early Access
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Help Shape the Future of Residential Wildfire Defense
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            We&apos;re developing a practical, engineered wildfire defense
            system for homeowners, builders, contractors, and property managers
            in wildfire-prone communities. Join the early access list to receive
            updates, design previews, pilot-program opportunities, and practical
            wildfire-defense research.
          </p>
        </div>

        {status === "success" ? (
          <div className="mt-10 rounded-lg border border-teal/30 bg-teal/5 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal/20">
              <svg className="h-6 w-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              You&apos;re on the list
            </h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Thank you for joining the early access list. We&apos;ll send
              updates on system development, pilot opportunities, and wildfire
              defense research for your area.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 text-sm text-teal hover:text-teal/80 transition-colors"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <input
              type="hidden"
              name="_subject"
              value="High Sierra Fire Defense — Early Access Signup"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="form-label">
                  Email address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="zip" className="form-label">
                  ZIP code *
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  required
                  pattern="[0-9]{5}"
                  placeholder="89501"
                  className="form-input"
                  maxLength={5}
                />
              </div>
            </div>

            <div>
              <label htmlFor="property_type" className="form-label">
                Property type *
              </label>
              <select
                id="property_type"
                name="property_type"
                required
                className="form-input"
                defaultValue=""
              >
                <option value="" disabled>
                  Select property type
                </option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="form-label">
                Tell us about your wildfire concerns (optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Property location, insurance concerns, past fire experience..."
                className="form-input resize-none"
              />
            </div>

            {status === "error" && (
              <div className="rounded-lg border border-ember/30 bg-ember/5 p-4 text-sm text-ember">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={status === "loading"}
              className="w-full sm:w-auto"
            >
              {status === "loading" ? "Submitting..." : "Join the Early Access List"}
            </Button>
          </form>
        )}
      </div>
    </Section>
  );
}
