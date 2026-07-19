import { describe, expect, it } from "vitest";
import { handleResendWebhookEvent } from "./resend-webhook";
import { createInMemorySupporterStore } from "@/lib/supporters/test-store";

describe("handleResendWebhookEvent", () => {
  it("records delivery events for the matching supporter", async () => {
    const store = createInMemorySupporterStore();
    store.supporters.push({
      id: "supporter-1",
      email_normalized: "amara@example.com",
      status: "verified",
      personal_referral_code: "DDDDDDDD",
    });

    await expect(
      handleResendWebhookEvent(
        {
          type: "email.delivered",
          created_at: "2026-07-19T12:00:00.000Z",
          data: {
            email_id: "email-1",
            to: ["Amara@Example.COM"],
          },
        },
        "event-1",
        store,
      ),
    ).resolves.toEqual({ state: "recorded" });

    expect(store.emailEvents).toEqual([
      expect.objectContaining({
        supporter_id: "supporter-1",
        type: "delivered",
        provider_event_id: "event-1",
        provider_message_id: "email-1",
        email_normalized: "amara@example.com",
      }),
    ]);
  });

  it("suppresses a supporter after a hard bounce", async () => {
    const store = createInMemorySupporterStore();
    store.supporters.push({
      id: "supporter-1",
      email_normalized: "amara@example.com",
      status: "verified",
      personal_referral_code: "DDDDDDDD",
    });

    await handleResendWebhookEvent(
      {
        type: "email.bounced",
        created_at: "2026-07-19T12:00:00.000Z",
        data: { email_id: "email-1", to: ["amara@example.com"] },
      },
      "event-1",
      store,
    );

    expect(await store.isSuppressed?.("supporter-1")).toBe(true);
    expect(store.supporters[0]?.suppression_reason).toBe("hard_bounce");
  });
});
