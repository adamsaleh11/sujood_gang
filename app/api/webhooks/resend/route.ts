import { type NextRequest, NextResponse } from "next/server";
import { Webhook, WebhookVerificationError } from "svix";
import { handleResendWebhookEvent } from "@/lib/email/resend-webhook";
import { env } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseSupporterStore } from "@/lib/supporters/supabase-store";

export async function POST(request: NextRequest) {
  if (!env.RESEND_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Resend webhook secret is not configured" },
      { status: 500 },
    );
  }

  const body = await request.text();
  const headers = {
    "svix-id": request.headers.get("svix-id") ?? "",
    "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
    "svix-signature": request.headers.get("svix-signature") ?? "",
  };

  let payload: unknown;
  try {
    payload = new Webhook(env.RESEND_WEBHOOK_SECRET).verify(body, headers);
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    throw error;
  }

  await handleResendWebhookEvent(
    payload as Parameters<typeof handleResendWebhookEvent>[0],
    headers["svix-id"],
    createSupabaseSupporterStore(createSupabaseAdminClient()),
  );

  return NextResponse.json({ received: true });
}
