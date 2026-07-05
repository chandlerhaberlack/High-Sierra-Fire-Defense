"use client";

import { useState, FormEvent } from "react";
import { site } from "@/lib/site";

export function SignupForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const formId = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "meewyvkr";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    if (!formId) {
      setStatus("error");
      setErrorMessage("Form not configured. Set NEXT_PUBLIC_FORMSPREE_ID.");
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const r = await res.json();
        setStatus("error");
        setErrorMessage(r.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-ink bg-paper-2 px-5 py-5">
        <p className="index-label">Confirmed</p>
        <p className="mt-2 font-display text-xl font-semibold text-ink">
          You&apos;re on the list.
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          We&apos;ll be in touch as the system develops.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <input
        type="hidden"
        name="_subject"
        value={`${site.name} — Early Access Signup`}
      />

      <div>
        <label htmlFor="signup-email" className="field-label">
          Email address
        </label>
        <input
          type="email"
          id="signup-email"
          name="email"
          required
          placeholder="you@example.com"
          className="field"
        />
      </div>

      <div>
        <label htmlFor="signup-zip" className="field-label">
          ZIP code
        </label>
        <input
          type="text"
          id="signup-zip"
          name="zip"
          required
          pattern="[0-9]{5}"
          maxLength={5}
          placeholder="89501"
          className="field"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-ember px-6 py-3 text-sm font-medium tracking-wide text-paper transition-colors hover:bg-ember-hover disabled:opacity-50"
      >
        {status === "loading" ? "Joining..." : "Join the Early Access List"}
      </button>

      {status === "error" && (
        <p className="text-sm text-ember">{errorMessage}</p>
      )}
    </form>
  );
}
