import { z } from "zod";
import { isCountryCode } from "./countries";
import { normalizeEmail, normalizeInstagram } from "./normalize";

/**
 * Consent copy/policy version recorded with each signup. Bump this string
 * whenever the consent language changes so `supporters.consent_version` reflects
 * exactly what a supporter agreed to.
 */
export const CONSENT_VERSION = "2026-07-18";

const INSTAGRAM_HANDLE = /^[a-z0-9._]+$/;

/**
 * Validation schema for the public signup form. Output is fully normalized —
 * email lowercased/trimmed, instagram reduced to a bare handle — so callers can
 * persist `parse` output directly. Bounds mirror the DB CHECK constraints.
 */
export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),

  email: z.string().transform(normalizeEmail).pipe(z.email().max(254)),

  countryCode: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .refine(isCountryCode, "Unsupported country"),

  city: z.string().trim().min(1, "City is required").max(80),

  instagram: z
    .string()
    .max(200)
    .transform(normalizeInstagram)
    .transform((value) => (value === "" ? undefined : value))
    .refine(
      (value) => value === undefined || value.length <= 30,
      "Instagram handle is too long",
    )
    .refine(
      (value) => value === undefined || INSTAGRAM_HANDLE.test(value),
      "Instagram handle contains invalid characters",
    )
    .optional(),

  referralCode: z
    .string()
    .trim()
    .max(32)
    .transform((value) => (value === "" ? undefined : value))
    .optional(),

  heardAbout: z
    .string()
    .trim()
    .max(200)
    .transform((value) => (value === "" ? undefined : value))
    .optional(),

  consent: z.literal(true, {
    message: "Consent is required",
  }),
});

export type SignupInput = z.input<typeof signupSchema>;
export type SignupData = z.output<typeof signupSchema>;
