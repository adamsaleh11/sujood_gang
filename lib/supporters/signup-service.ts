import { createHash, randomBytes as nodeRandomBytes } from "node:crypto";
import {
  CONSENT_VERSION,
  signupSchema,
  type SignupInput,
} from "@/lib/validation/signup";

export type SupporterStatus = "pending" | "verified" | "unsubscribed";

export type SupporterRecord = {
  id: string;
  email_normalized: string;
  status: SupporterStatus;
  personal_referral_code: string | null;
  name?: string;
  country_code?: string;
  city?: string;
  instagram?: string;
  referral_code_used?: string;
  referred_by?: string;
  acquisition_source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_path?: string;
  referrer?: string;
  consent_version?: string;
  consent_at?: Date;
  verification_sent_at?: Date;
};

export type VerificationTokenRecord = {
  id: string;
  supporter_id: string;
  token_hash: string;
  expires_at: Date;
  used_at: Date | null;
};

export type AttributionInput = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_path?: string;
  referrer?: string;
  ref?: string;
};

export type SupporterStore = {
  findSupporterByEmail(email: string): Promise<SupporterRecord | null>;
  createSupporter(row: {
    name: string;
    email_normalized: string;
    country_code: string;
    city: string;
    instagram?: string;
    referral_code_used?: string;
    referred_by?: string;
    acquisition_source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    landing_path?: string;
    referrer?: string;
    consent_version: string;
    consent_at: Date;
    verification_sent_at: Date;
  }): Promise<SupporterRecord>;
  findVerifiedSupporterByReferralCode(
    code: string,
  ): Promise<SupporterRecord | null>;
  issueVerificationToken(row: {
    supporter_id: string;
    token_hash: string;
    expires_at: Date;
    now: Date;
  }): Promise<void>;
  findVerificationTokenByHash?(
    tokenHash: string,
  ): Promise<VerificationTokenRecord | null>;
  findSupporterById?(id: string): Promise<SupporterRecord | null>;
  markSupporterVerified?(params: {
    token_id: string;
    supporter_id: string;
    verified_at: Date;
    personal_referral_code: string;
  }): Promise<SupporterRecord>;
};

export type CreateSupporterResult =
  | { state: "accepted" }
  | { state: "already_verified" }
  | { state: "created" }
  | { state: "pending" }
  | { state: "rate_limited"; retryAfterSeconds?: number }
  | { state: "validation_error" };

export type ResendVerificationResult =
  | { state: "accepted" }
  | { state: "already_verified" }
  | { state: "pending" }
  | { state: "rate_limited"; retryAfterSeconds?: number }
  | { state: "validation_error" };

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds?: number;
};

export type SignupServiceDependencies = {
  store: SupporterStore;
  rateLimit: (key: string) => Promise<RateLimitResult>;
  sendConfirmationEmail: (message: {
    to: string;
    token: string;
    supporterId: string;
  }) => Promise<void>;
  now?: () => Date;
  randomBytes?: (size: number) => Buffer;
  tokenTtlHours?: number;
};

export type CreateSupporterContext = {
  ip: string;
};

export type CreateSupporterInput = Omit<SignupInput, "consent"> & {
  consent: boolean;
  website?: string;
  attribution?: AttributionInput;
};

export function createSupporterSignupService({
  store,
  rateLimit,
  sendConfirmationEmail,
  now = () => new Date(),
  randomBytes = nodeRandomBytes,
  tokenTtlHours = 48,
}: SignupServiceDependencies) {
  return {
    async createSupporter(
      input: CreateSupporterInput,
      context: CreateSupporterContext,
    ): Promise<CreateSupporterResult> {
      if (input.website?.trim()) {
        return { state: "accepted" };
      }

      const limit = await rateLimit(`signup:${context.ip}`);
      if (!limit.allowed) {
        return {
          state: "rate_limited",
          retryAfterSeconds: limit.retryAfterSeconds,
        };
      }

      const parsed = signupSchema.safeParse(input);
      if (!parsed.success) {
        return { state: "validation_error" };
      }

      const data = parsed.data;
      const existing = await store.findSupporterByEmail(data.email);
      if (existing?.status === "verified") {
        return { state: "already_verified" };
      }
      if (existing) {
        return { state: "pending" };
      }

      const timestamp = now();
      const referralCode = normalizeAttributionValue(
        input.attribution?.ref ?? data.referralCode,
        32,
      );
      const referrer = referralCode
        ? await store.findVerifiedSupporterByReferralCode(referralCode)
        : null;
      const supporter = await store.createSupporter({
        name: data.name,
        email_normalized: data.email,
        country_code: data.countryCode,
        city: data.city,
        instagram: data.instagram,
        referral_code_used: referralCode,
        referred_by: referrer?.id,
        acquisition_source: data.heardAbout,
        ...normalizeAttribution(input.attribution),
        consent_version: CONSENT_VERSION,
        consent_at: timestamp,
        verification_sent_at: timestamp,
      });
      await issueAndSendVerification({
        store,
        sendConfirmationEmail,
        randomBytes,
        supporter,
        timestamp,
        tokenTtlHours,
      });

      return { state: "created" };
    },

    async resendVerification(
      email: string,
      context: CreateSupporterContext,
    ): Promise<ResendVerificationResult> {
      const limit = await rateLimit(`resend:${context.ip}`);
      if (!limit.allowed) {
        return {
          state: "rate_limited",
          retryAfterSeconds: limit.retryAfterSeconds,
        };
      }

      const parsed = signupSchema.shape.email.safeParse(email);
      if (!parsed.success) return { state: "validation_error" };

      const supporter = await store.findSupporterByEmail(parsed.data);
      if (!supporter) return { state: "accepted" };
      if (supporter.status === "verified") {
        return { state: "already_verified" };
      }

      await issueAndSendVerification({
        store,
        sendConfirmationEmail,
        randomBytes,
        supporter,
        timestamp: now(),
        tokenTtlHours,
      });
      return { state: "pending" };
    },
  };
}

export function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

export function createRawToken(randomBytes: (size: number) => Buffer): string {
  return randomBytes(32).toString("base64url");
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

async function issueAndSendVerification({
  store,
  sendConfirmationEmail,
  randomBytes,
  supporter,
  timestamp,
  tokenTtlHours,
}: {
  store: SupporterStore;
  sendConfirmationEmail: SignupServiceDependencies["sendConfirmationEmail"];
  randomBytes: (size: number) => Buffer;
  supporter: SupporterRecord;
  timestamp: Date;
  tokenTtlHours: number;
}) {
  const token = createRawToken(randomBytes);
  await store.issueVerificationToken({
    supporter_id: supporter.id,
    token_hash: hashToken(token),
    expires_at: addHours(timestamp, tokenTtlHours),
    now: timestamp,
  });
  await sendConfirmationEmail({
    to: supporter.email_normalized,
    token,
    supporterId: supporter.id,
  });
}

function normalizeAttribution(attribution?: AttributionInput) {
  return {
    utm_source: normalizeAttributionValue(attribution?.utm_source, 200),
    utm_medium: normalizeAttributionValue(attribution?.utm_medium, 200),
    utm_campaign: normalizeAttributionValue(attribution?.utm_campaign, 200),
    utm_content: normalizeAttributionValue(attribution?.utm_content, 200),
    utm_term: normalizeAttributionValue(attribution?.utm_term, 200),
    landing_path: normalizeAttributionValue(attribution?.landing_path, 500),
    referrer: normalizeAttributionValue(attribution?.referrer, 500),
  };
}

function normalizeAttributionValue(value: string | undefined, max: number) {
  const normalized = value?.trim();
  if (!normalized) return undefined;
  return normalized.slice(0, max);
}
