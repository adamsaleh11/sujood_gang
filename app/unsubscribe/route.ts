import { type NextRequest, NextResponse } from "next/server";
import { siteCopy } from "@/lib/content/copy";
import { env } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseSupporterStore } from "@/lib/supporters/supabase-store";
import { parseUnsubscribeToken } from "@/lib/supporters/unsubscribe";

export async function GET(request: NextRequest) {
  return unsubscribe(request);
}

export async function POST(request: NextRequest) {
  return unsubscribe(request);
}

async function unsubscribe(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const payload = parseUnsubscribeToken(token, env.EMAIL_TOKEN_SECRET);
  if (!payload) {
    return htmlResponse("This unsubscribe link is invalid.", 400);
  }

  const store = createSupabaseSupporterStore(createSupabaseAdminClient());
  const supporter = await store.findSupporterById?.(payload.supporterId);
  if (!supporter || supporter.email_normalized !== payload.email) {
    return htmlResponse("This unsubscribe link is invalid.", 400);
  }

  await store.unsubscribeSupporter?.({
    supporter_id: supporter.id,
    unsubscribed_at: new Date(),
  });

  return htmlResponse(
    "You have been unsubscribed from future Sujood Gang updates. To resubscribe, return to the signup form and confirm your email again.",
  );
}

function htmlResponse(message: string, status = 200) {
  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Unsubscribe | ${escapeHtml(siteCopy.brand.name)}</title></head><body><main><h1>Unsubscribe</h1><p>${escapeHtml(message)}</p><p><a href="/#join">Return to signup</a></p></main></body></html>`,
    {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}
