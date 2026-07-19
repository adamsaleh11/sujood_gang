import type { SupabaseClient } from "@supabase/supabase-js";
import type { RateLimitResult } from "@/lib/supporters/signup-service";

export function createPostgresRateLimit(
  supabase: SupabaseClient,
  options: { limit: number; windowSeconds: number },
) {
  return async function rateLimit(key: string): Promise<RateLimitResult> {
    const now = new Date();
    const windowStart = new Date(
      now.getTime() - options.windowSeconds * 1000,
    ).toISOString();

    const { count, error: countError } = await supabase
      .from("rate_limit_events")
      .select("id", { count: "exact", head: true })
      .eq("key", key)
      .gte("created_at", windowStart);
    if (countError) throw countError;

    if ((count ?? 0) >= options.limit) {
      return { allowed: false, retryAfterSeconds: options.windowSeconds };
    }

    const { error: insertError } = await supabase
      .from("rate_limit_events")
      .insert({ key, created_at: now.toISOString() });
    if (insertError) throw insertError;

    return { allowed: true };
  };
}
