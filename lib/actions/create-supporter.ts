"use server";

import { headers } from "next/headers";
import { createPostgresRateLimit } from "@/lib/rate-limit/postgres";
import {
  sendConfirmationEmail,
  sendWelcomeEmail,
} from "@/lib/email/supporter-email";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseSupporterStore } from "@/lib/supporters/supabase-store";
import {
  createSupporterSignupService,
  type AttributionInput,
  type CreateSupporterInput,
} from "@/lib/supporters/signup-service";
import { createSupporterVerificationService } from "@/lib/supporters/verification-service";
import { env } from "@/lib/env";

export async function createSupporter(input: CreateSupporterInput | FormData) {
  const supabase = createSupabaseAdminClient();
  const service = createSupporterSignupService({
    store: createSupabaseSupporterStore(supabase),
    rateLimit: createPostgresRateLimit(supabase, {
      limit: 5,
      windowSeconds: 60 * 10,
    }),
    sendConfirmationEmail,
    tokenTtlHours: env.VERIFICATION_TOKEN_TTL_HOURS,
    tokenSecret: env.EMAIL_TOKEN_SECRET,
  });

  return service.createSupporter(parseCreateInput(input), {
    ip: await requestIp(),
  });
}

export async function resendVerification(email: string) {
  const supabase = createSupabaseAdminClient();
  const service = createSupporterSignupService({
    store: createSupabaseSupporterStore(supabase),
    rateLimit: createPostgresRateLimit(supabase, {
      limit: 3,
      windowSeconds: 60 * 30,
    }),
    sendConfirmationEmail,
    tokenTtlHours: env.VERIFICATION_TOKEN_TTL_HOURS,
    tokenSecret: env.EMAIL_TOKEN_SECRET,
  });

  return service.resendVerification(email, { ip: await requestIp() });
}

export async function verifySupporter(rawToken: string) {
  const supabase = createSupabaseAdminClient();
  const service = createSupporterVerificationService({
    store: createSupabaseSupporterStore(supabase),
    sendWelcomeEmail,
    tokenSecret: env.EMAIL_TOKEN_SECRET,
  });

  return service.verifySupporter(rawToken);
}

async function requestIp() {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  return (
    forwardedFor?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown"
  );
}

function parseCreateInput(input: CreateSupporterInput | FormData) {
  if (!(input instanceof FormData)) return input;

  return {
    name: formString(input, "name"),
    email: formString(input, "email"),
    countryCode: formString(input, "countryCode"),
    city: formString(input, "city"),
    instagram: formString(input, "instagram"),
    referralCode: formString(input, "referralCode"),
    heardAbout: formString(input, "heardAbout"),
    consent: input.get("consent") === "true" || input.get("consent") === "on",
    website: formString(input, "website"),
    attribution: parseAttribution(formString(input, "attribution")),
  };
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function parseAttribution(value: string): AttributionInput | undefined {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value) as AttributionInput;
    return parsed && typeof parsed === "object" ? parsed : undefined;
  } catch {
    return undefined;
  }
}
