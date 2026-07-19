/**
 * Normalize an email for storage and dedupe: trim surrounding whitespace and
 * lowercase. The result is what we persist in `supporters.email_normalized`
 * and enforce a UNIQUE constraint on, so normalization must be deterministic.
 */
export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

/**
 * Normalize an Instagram handle to a bare, lowercased username. Accepts what
 * users actually paste — `@handle`, `instagram.com/handle`, a full profile URL
 * with scheme/`www`, and trailing slashes — and reduces them all to `handle`.
 * Returns "" when nothing usable remains (callers treat instagram as optional).
 */
export function normalizeInstagram(input: string): string {
  let value = input.trim().toLowerCase();

  // Drop scheme and any instagram.com host prefix (with or without www).
  value = value.replace(/^https?:\/\//, "");
  value = value.replace(/^www\./, "");
  value = value.replace(/^instagram\.com\//, "");

  // Drop a leading @ and any surrounding slashes.
  value = value.replace(/^@+/, "");
  value = value.replace(/^\/+/, "").replace(/\/+$/, "");

  return value;
}
