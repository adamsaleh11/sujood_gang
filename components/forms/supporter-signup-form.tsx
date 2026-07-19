"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { createSupporter } from "@/lib/actions/create-supporter";
import {
  captureAttributionOnLanding,
  readAttributionPayload,
} from "@/lib/attribution/client";
import type { SignupFormCopy } from "@/lib/content/copy";
import type { CreateSupporterResult } from "@/lib/supporters/signup-service";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SupporterSignupFormProps = {
  copy: SignupFormCopy;
  countryCodes: readonly string[];
};

type SubmitState = CreateSupporterResult["state"] | "idle" | "unexpected_error";

export function SupporterSignupForm({
  copy,
  countryCodes,
}: SupporterSignupFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    captureAttributionOnLanding();
  }, []);

  function handleSubmit(formData: FormData) {
    setSubmitState("idle");
    const attribution = readAttributionPayload();
    if (attribution) {
      formData.set("attribution", JSON.stringify(attribution));
    }

    startTransition(async () => {
      try {
        const result = await createSupporter(formData);
        setSubmitState(result.state);
        if (result.state === "created") {
          formRef.current?.reset();
        }
      } catch {
        setSubmitState("unexpected_error");
      }
    });
  }

  const message = statusMessage(copy, submitState);
  const isSuccess =
    submitState === "created" ||
    submitState === "pending" ||
    submitState === "already_verified" ||
    submitState === "accepted";

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label={copy.labels.name}
          name="name"
          autoComplete="name"
          placeholder={copy.placeholders.name}
          required
        />
        <FormField
          label={copy.labels.email}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={copy.placeholders.email}
          required
        />
        <label className="space-y-2">
          <span className="text-sm font-medium">{copy.labels.countryCode}</span>
          <span className="relative block">
            <select
              name="countryCode"
              required
              defaultValue=""
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-11 w-full appearance-none rounded-lg border px-3 pr-10 text-sm transition-shadow outline-none focus-visible:ring-3"
            >
              <option value="" disabled>
                {copy.countryDefaultOption}
              </option>
              {countryCodes.map((countryCode) => (
                <option key={countryCode} value={countryCode}>
                  {countryCode}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
            />
          </span>
        </label>
        <FormField
          label={copy.labels.city}
          name="city"
          autoComplete="address-level2"
          placeholder={copy.placeholders.city}
          required
        />
        <FormField
          label={copy.labels.instagram}
          name="instagram"
          autoComplete="off"
          placeholder={copy.placeholders.instagram}
        />
        <FormField
          label={copy.labels.referralCode}
          name="referralCode"
          autoComplete="off"
          placeholder={copy.placeholders.referralCode}
        />
      </div>

      <FormField
        label={copy.labels.heardAbout}
        name="heardAbout"
        autoComplete="off"
        placeholder={copy.placeholders.heardAbout}
      />

      <label className="border-border bg-background/70 flex gap-3 rounded-lg border p-3 text-sm leading-6">
        <input
          type="checkbox"
          name="consent"
          className="border-input accent-primary mt-1 size-4 rounded"
          required
        />
        <span>{copy.labels.consent}</span>
      </label>

      <label className="sr-only">
        {copy.honeypotLabel}
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {message ? (
        <p
          aria-live="polite"
          className={cn(
            "flex items-start gap-2 rounded-lg border p-3 text-sm leading-6",
            isSuccess
              ? "border-primary/20 bg-primary/10 text-foreground"
              : "border-destructive/20 bg-destructive/10 text-destructive",
          )}
        >
          {isSuccess ? (
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4" />
          ) : null}
          {message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="min-h-12 w-full px-5"
      >
        {isPending ? (
          <>
            <Loader2 aria-hidden="true" className="animate-spin" />
            {copy.pendingLabel}
          </>
        ) : (
          <>
            {copy.submitLabel}
            <ArrowRight aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}

function FormField({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-11 w-full rounded-lg border px-3 text-sm transition-shadow outline-none focus-visible:ring-3"
      />
    </label>
  );
}

function statusMessage(copy: SignupFormCopy, state: SubmitState) {
  switch (state) {
    case "created":
      return copy.statusLabels.created;
    case "pending":
      return copy.statusLabels.pending;
    case "already_verified":
      return copy.statusLabels.alreadyVerified;
    case "accepted":
      return copy.statusLabels.accepted;
    case "rate_limited":
      return copy.statusLabels.rateLimited;
    case "validation_error":
      return copy.statusLabels.validationError;
    case "email_send_failed":
      return copy.statusLabels.emailSendFailed;
    case "unexpected_error":
      return copy.statusLabels.unexpectedError;
    case "idle":
      return null;
  }
}
