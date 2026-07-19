import { describe, expect, it } from "vitest";
import { createInMemorySupporterStore } from "./test-store";

describe("supporter suppression", () => {
  it("suppresses future non-transactional sends after unsubscribe", async () => {
    const store = createInMemorySupporterStore();
    store.supporters.push({
      id: "supporter-1",
      email_normalized: "amara@example.com",
      status: "verified",
      personal_referral_code: "DDDDDDDD",
    });

    await store.unsubscribeSupporter?.({
      supporter_id: "supporter-1",
      unsubscribed_at: new Date("2026-07-19T12:00:00.000Z"),
    });

    expect(await store.isSuppressed?.("supporter-1")).toBe(true);
    expect(store.supporters[0]).toMatchObject({
      status: "unsubscribed",
      unsubscribed_at: new Date("2026-07-19T12:00:00.000Z"),
    });
  });

  it("suppresses future sends after a complaint", async () => {
    const store = createInMemorySupporterStore();
    store.supporters.push({
      id: "supporter-1",
      email_normalized: "amara@example.com",
      status: "verified",
      personal_referral_code: "DDDDDDDD",
    });

    await store.suppressSupporter?.({
      supporter_id: "supporter-1",
      suppressed_at: new Date("2026-07-19T12:00:00.000Z"),
      suppression_reason: "complained",
    });

    expect(await store.isSuppressed?.("supporter-1")).toBe(true);
    expect(store.supporters[0]).toMatchObject({
      suppressed_at: new Date("2026-07-19T12:00:00.000Z"),
      suppression_reason: "complained",
    });
  });
});
