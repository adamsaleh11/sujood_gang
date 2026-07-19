import { describe, expect, it } from "vitest";
import { hashToken } from "./signup-service";
import { createInMemorySupporterStore } from "./test-store";
import { createSupporterVerificationService } from "./verification-service";

function service() {
  const store = createInMemorySupporterStore();
  const verify = createSupporterVerificationService({
    store,
    now: () => new Date("2026-07-19T12:00:00.000Z"),
    randomBytes: (size) => Buffer.alloc(size, 3),
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
      token_hash: hashToken("expired-token"),
      expires_at: new Date("2026-07-19T11:59:59.000Z"),
      used_at: null,
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
      token_hash: hashToken("valid-token"),
      expires_at: new Date("2026-07-21T12:00:00.000Z"),
      used_at: null,
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
      token_hash: hashToken("valid-token"),
      expires_at: new Date("2026-07-21T12:00:00.000Z"),
      used_at: null,
    });

    await expect(verify.verifySupporter("valid-token")).resolves.toEqual({
      state: "success",
      referralCode: "KEEP1234",
    });
    expect(store.supporters[0]?.personal_referral_code).toBe("KEEP1234");
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
      token_hash: hashToken("invalidated-token"),
      expires_at: new Date("2026-07-21T12:00:00.000Z"),
      used_at: new Date("2026-07-19T12:00:00.000Z"),
    });

    await expect(verify.verifySupporter("invalidated-token")).resolves.toEqual({
      state: "invalid",
    });
    expect(store.supporters[0]?.status).toBe("pending");
  });
});
