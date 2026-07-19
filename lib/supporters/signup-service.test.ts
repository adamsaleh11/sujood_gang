import { describe, expect, it } from "vitest";
import {
  createSupporterSignupService,
  hashToken,
  type CreateSupporterInput,
} from "./signup-service";
import { createInMemorySupporterStore } from "./test-store";

const baseInput = {
  name: "Amara Okafor",
  email: "  Amara@Example.COM ",
  countryCode: "gb",
  city: " London ",
  instagram: "@amara",
  referralCode: "FRIEND123",
  heardAbout: "Instagram",
  consent: true,
} satisfies CreateSupporterInput;

const tokenSecret = "test-token-secret-test-token-secret";

function service() {
  const store = createInMemorySupporterStore();
  const sent: string[] = [];
  const signup = createSupporterSignupService({
    store,
    rateLimit: async () => ({ allowed: true }),
    sendConfirmationEmail: async ({ to }) => {
      sent.push(to);
    },
    now: () => new Date("2026-07-19T12:00:00.000Z"),
    randomBytes: (size) => Buffer.alloc(size, 7),
    tokenSecret,
  });

  return { signup, store, sent };
}

function rateLimitedService() {
  const store = createInMemorySupporterStore();
  const signup = createSupporterSignupService({
    store,
    rateLimit: async () => ({ allowed: false, retryAfterSeconds: 60 }),
    sendConfirmationEmail: async () => {},
    now: () => new Date("2026-07-19T12:00:00.000Z"),
    randomBytes: (size) => Buffer.alloc(size, 7),
    tokenSecret,
  });

  return { signup, store };
}

describe("createSupporterSignupService", () => {
  it("uses the token secret when hashing verification tokens", () => {
    expect(hashToken("same-token", "a".repeat(32))).not.toBe(
      hashToken("same-token", "b".repeat(32)),
    );
  });

  it("is idempotent by normalized email without creating duplicate rows", async () => {
    const { signup, store, sent } = service();

    await expect(
      signup.createSupporter(baseInput, { ip: "203.0.113.10" }),
    ).resolves.toMatchObject({ state: "created" });
    await expect(
      signup.createSupporter(
        { ...baseInput, email: "amara@example.com" },
        { ip: "203.0.113.10" },
      ),
    ).resolves.toMatchObject({ state: "pending" });

    expect(store.supporters).toHaveLength(1);
    expect(sent).toEqual(["amara@example.com"]);
  });

  it("silently accepts honeypot submissions without side effects", async () => {
    const { signup, store, sent } = service();

    await expect(
      signup.createSupporter(
        { ...baseInput, website: "https://spam.example" },
        { ip: "203.0.113.11" },
      ),
    ).resolves.toMatchObject({ state: "accepted" });

    expect(store.supporters).toHaveLength(0);
    expect(store.tokens).toHaveLength(0);
    expect(sent).toHaveLength(0);
  });

  it("returns a distinct rate_limited state without creating a supporter", async () => {
    const { signup, store } = rateLimitedService();

    await expect(
      signup.createSupporter(baseInput, { ip: "203.0.113.12" }),
    ).resolves.toEqual({ state: "rate_limited", retryAfterSeconds: 60 });
    expect(store.supporters).toHaveLength(0);
  });

  it("does not mark verification as sent when the confirmation email fails", async () => {
    const store = createInMemorySupporterStore();
    const signup = createSupporterSignupService({
      store,
      rateLimit: async () => ({ allowed: true }),
      sendConfirmationEmail: async () => {
        throw new Error("provider unavailable");
      },
      now: () => new Date("2026-07-19T12:00:00.000Z"),
      randomBytes: (size) => Buffer.alloc(size, 7),
      tokenSecret,
    });

    await expect(
      signup.createSupporter(baseInput, { ip: "203.0.113.12" }),
    ).resolves.toEqual({ state: "email_send_failed" });

    expect(store.supporters).toHaveLength(1);
    expect(store.supporters[0]).toMatchObject({
      email_normalized: "amara@example.com",
      status: "pending",
    });
    expect(store.supporters[0]?.verification_sent_at).toBeUndefined();
  });

  it("resending verification invalidates prior unused tokens", async () => {
    const { signup, store, sent } = service();

    await signup.createSupporter(baseInput, { ip: "203.0.113.13" });
    await expect(
      signup.resendVerification("amara@example.com", { ip: "203.0.113.13" }),
    ).resolves.toEqual({ state: "pending" });

    expect(store.tokens).toHaveLength(2);
    expect(store.tokens[0]?.used_at).toEqual(
      new Date("2026-07-19T12:00:00.000Z"),
    );
    expect(store.tokens[1]?.used_at).toBeNull();
    expect(sent).toEqual(["amara@example.com", "amara@example.com"]);
  });

  it("rate limits resending verification to three issued tokens per day for the email", async () => {
    const { signup, store, sent } = service();

    await signup.createSupporter(baseInput, { ip: "203.0.113.13" });
    await signup.resendVerification("amara@example.com", {
      ip: "203.0.113.13",
    });
    await signup.resendVerification("amara@example.com", {
      ip: "203.0.113.13",
    });

    await expect(
      signup.resendVerification("amara@example.com", { ip: "203.0.113.13" }),
    ).resolves.toEqual({
      state: "rate_limited",
      retryAfterSeconds: 86400,
    });
    expect(store.tokens).toHaveLength(3);
    expect(sent).toEqual([
      "amara@example.com",
      "amara@example.com",
      "amara@example.com",
    ]);
  });

  it("stores campaign attribution separately from referral attribution", async () => {
    const { signup, store } = service();
    store.supporters.push({
      id: "supporter-referrer",
      email_normalized: "friend@example.com",
      status: "verified",
      personal_referral_code: "ABC123",
    });

    await signup.createSupporter(
      {
        ...baseInput,
        email: "new@example.com",
        attribution: {
          utm_source: "ig",
          utm_medium: "social",
          utm_campaign: "launch",
          landing_path: "/?utm_source=ig&ref=ABC123",
          referrer: "https://example.com/article",
          ref: "ABC123",
        },
      },
      { ip: "203.0.113.14" },
    );

    expect(store.supporters[1]).toMatchObject({
      email_normalized: "new@example.com",
      referral_code_used: "ABC123",
      referred_by: "supporter-referrer",
      utm_source: "ig",
      utm_medium: "social",
      utm_campaign: "launch",
      landing_path: "/?utm_source=ig&ref=ABC123",
      referrer: "https://example.com/article",
    });
  });
});
