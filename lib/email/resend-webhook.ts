import { normalizeEmail } from "@/lib/validation/normalize";
import type { SupporterStore } from "@/lib/supporters/signup-service";

type ResendWebhookPayload = {
  type?: string;
  created_at?: string;
  data?: {
    email_id?: string;
    to?: string | string[];
    email?: string;
  };
};

type SupportedEmailEvent = "delivered" | "bounced" | "complained" | "failed";

const EVENT_TYPES: Record<string, SupportedEmailEvent | undefined> = {
  "email.delivered": "delivered",
  "email.bounced": "bounced",
  "email.complained": "complained",
  "email.failed": "failed",
};

export async function handleResendWebhookEvent(
  payload: ResendWebhookPayload,
  providerEventId: string | undefined,
  store: SupporterStore,
) {
  const type = payload.type ? EVENT_TYPES[payload.type] : undefined;
  if (!type) return { state: "ignored" } as const;

  const email = extractEmail(payload);
  const supporter = email ? await store.findSupporterByEmail(email) : null;
  const createdAt = payload.created_at
    ? new Date(payload.created_at)
    : new Date();

  await store.recordEmailEvent?.({
    supporter_id: supporter?.id ?? null,
    type,
    provider_event_id: providerEventId,
    provider_message_id: payload.data?.email_id,
    email_normalized: email,
    provider_payload: payload,
    created_at: createdAt,
  });

  if (supporter && type === "bounced") {
    await store.suppressSupporter?.({
      supporter_id: supporter.id,
      suppressed_at: createdAt,
      suppression_reason: "hard_bounce",
    });
  }

  if (supporter && type === "complained") {
    await store.suppressSupporter?.({
      supporter_id: supporter.id,
      suppressed_at: createdAt,
      suppression_reason: "complained",
    });
  }

  return { state: "recorded" } as const;
}

function extractEmail(payload: ResendWebhookPayload) {
  const to = payload.data?.to;
  const value = Array.isArray(to) ? to[0] : (to ?? payload.data?.email);
  return value ? normalizeEmail(value) : undefined;
}
