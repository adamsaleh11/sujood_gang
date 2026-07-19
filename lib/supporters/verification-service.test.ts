import { describe, expect, it } from "vitest";
import { hashToken } from "./signup-service";
import { createInMemorySupporterStore } from "./test-store";
import { createSupporterVerificationService } from "./verification-service";

const tokenSecret = "test-token-secret-test-token-secret";

function service() {
  const store = createInMemorySupporterStore();
  const verify = createSupporterVerificationService({
    store,
    now: () => new Date("2026-07-19T12:00:00.000Z"),
    randomBytes: (size) => Buffer.alloc(size, 3),
    tokenSecret,
  });
  return { store, verify };
}

describe("createSupporterVerificationService", () => {
  it("rejects expired tokens without verifying the supporter", async () => {
    const { store, verify } = service();
    store.supporters.push({
      id: "supporter-1",
      email_normalized: "amara@example.com",
      status: "pending",
      personal_referral_code: null,
    });
    store.tokens.push({
      id: "token-1",
      supporter_id: "supporter-1",
      token_hash: hashToken("expired-token", tokenSecret),
      expires_at: new Date("2026-07-19T11:59:59.000Z"),
      used_at: null,
      created_at: new Date("2026-07-18T12:00:00.000Z"),
    });

    await expect(verify.verifySupporter("expired-token")).resolves.toEqual({
      state: "expired",
    });
    expect(store.supporters[0]?.status).toBe("pending");
  });

  it("verifies once and returns already_verified on a repeat click", async () => {
    const { store, verify } = service();
    store.supporters.push({
      id: "supporter-1",
      email_normalized: "amara@example.com",
      status: "pending",
      personal_referral_code: null,
    });
    store.tokens.push({
      id: "token-1",
      supporter_id: "supporter-1",
      token_hash: hashToken("valid-token", tokenSecret),
      expires_at: new Date("2026-07-21T12:00:00.000Z"),
      used_at: null,
      created_at: new Date("2026-07-19T12:00:00.000Z"),
    });

    await expect(verify.verifySupporter("valid-token")).resolves.toEqual({
      state: "success",
      referralCode: "DDDDDDDD",
    });
    await expect(verify.verifySupporter("valid-token")).resolves.toEqual({
      state: "already_verified",
      referralCode: "DDDDDDDD",
    });
    expect(store.supporters[0]).toMatchObject({
      status: "verified",
      personal_referral_code: "DDDDDDDD",
    });
  });

  it("does not replace an existing personal referral code on verification", async () => {
    const { store, verify } = service();
    store.supporters.push({
      id: "supporter-1",
      email_normalized: "amara@example.com",
      status: "pending",
      personal_referral_code: "KEEP1234",
    });
    store.tokens.push({
      id: "token-1",
      supporter_id: "supporter-1",
      token_hash: hashToken("valid-token", tokenSecret),
      expires_at: new Date("2026-07-21T12:00:00.000Z"),
      used_at: null,
      created_at: new Date("2026-07-19T12:00:00.000Z"),
    });

    await expect(verify.verifySupporter("valid-token")).resolves.toEqual({
      state: "success",
      referralCode: "KEEP1234",
    });
    expect(store.supporters[0]?.personal_referral_code).toBe("KEEP1234");
  });

  it("does not send a welcome email when the supporter is suppressed", async () => {
    const store = createInMemorySupporterStore();
    const sent: string[] = [];
    const verify = createSupporterVerificationService({
      store,
      sendWelcomeEmail: async ({ to }) => {
        sent.push(to);
      },
      now: () => new Date("2026-07-19T12:00:00.000Z"),
      randomBytes: (size) => Buffer.alloc(size, 3),
      tokenSecret,
    });
    store.supporters.push({
      id: "supporter-1",
      email_normalized: "amara@example.com",
      status: "pending",
      personal_referral_code: null,
      suppressed_at: new Date("2026-07-19T11:00:00.000Z"),
      suppression_reason: "hard_bounce",
    });
    store.tokens.push({
      id: "token-1",
      supporter_id: "supporter-1",
      token_hash: hashToken("valid-token", tokenSecret),
      expires_at: new Date("2026-07-21T12:00:00.000Z"),
      used_at: null,
      created_at: new Date("2026-07-19T12:00:00.000Z"),
    });

    await expect(verify.verifySupporter("valid-token")).resolves.toEqual({
      state: "success",
      referralCode: "DDDDDDDD",
    });
    expect(sent).toEqual([]);
  });

  it("rejects a used token while the supporter is still pending", async () => {
    const { store, verify } = service();
    store.supporters.push({
      id: "supporter-1",
      email_normalized: "amara@example.com",
      status: "pending",
      personal_referral_code: null,
    });
    store.tokens.push({
      id: "token-1",
      supporter_id: "supporter-1",
      token_hash: hashToken("invalidated-token", tokenSecret),
      expires_at: new Date("2026-07-21T12:00:00.000Z"),
      used_at: new Date("2026-07-19T12:00:00.000Z"),
      created_at: new Date("2026-07-19T12:00:00.000Z"),
    });

    await expect(verify.verifySupporter("invalidated-token")).resolves.toEqual({
      state: "invalid",
    });
    expect(store.supporters[0]?.status).toBe("pending");
  });
});
