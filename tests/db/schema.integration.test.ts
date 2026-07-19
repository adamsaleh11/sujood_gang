import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * DB-level acceptance tests for T3. Requires a running local Supabase
 * (`supabase start`) and the deterministic local keys, which CI exports with
 * `supabase status -o env`. Connection details come from env so the same test
 * runs locally and in CI:
 *
 *   SUPABASE_TEST_URL       (default http://127.0.0.1:54321)
 *   SUPABASE_TEST_ANON_KEY        — anon (public) key, RLS-restricted
 *   SUPABASE_TEST_SERVICE_ROLE_KEY — service role, bypasses RLS
 */
const url = process.env.SUPABASE_TEST_URL ?? "http://127.0.0.1:54321";
const anonKey = process.env.SUPABASE_TEST_ANON_KEY ?? "";
const serviceKey = process.env.SUPABASE_TEST_SERVICE_ROLE_KEY ?? "";

const admin: SupabaseClient = createClient(url, serviceKey, {
  auth: { persistSession: false },
});
const anon: SupabaseClient = createClient(url, anonKey, {
  auth: { persistSession: false },
});

function newSupporter(email: string) {
  return {
    name: "Test Supporter",
    email_normalized: email,
    country_code: "GB",
    city: "London",
    status: "pending",
    consent_version: "2026-07-18",
    consent_at: new Date().toISOString(),
  };
}

const createdIds: string[] = [];
let parentSupporterId = "";
const anonInsertEmail = `anon-rls-${Date.now()}@example.com`;

beforeAll(async () => {
  if (!anonKey || !serviceKey) {
    throw new Error(
      "SUPABASE_TEST_ANON_KEY and SUPABASE_TEST_SERVICE_ROLE_KEY must be set " +
        "(run `supabase start` and export `supabase status -o env`).",
    );
  }

  const parent = await admin
    .from("supporters")
    .insert(newSupporter(`parent-${Date.now()}@example.com`))
    .select("id")
    .single();
  if (parent.error) throw parent.error;

  parentSupporterId = parent.data.id as string;
  createdIds.push(parentSupporterId);
});

afterAll(async () => {
  await admin
    .from("supporters")
    .delete()
    .eq("email_normalized", anonInsertEmail);
  if (createdIds.length > 0) {
    await admin.from("supporters").delete().in("id", createdIds);
  }
});

describe("supporters schema (service role)", () => {
  it("rejects a duplicate email_normalized at the database level", async () => {
    const email = `dupe-${Date.now()}@example.com`;

    const first = await admin
      .from("supporters")
      .insert(newSupporter(email))
      .select("id")
      .single();
    expect(first.error).toBeNull();
    if (first.data) createdIds.push(first.data.id as string);

    const second = await admin.from("supporters").insert(newSupporter(email));
    expect(second.error).not.toBeNull();
    // 23505 = unique_violation
    expect(second.error?.code).toBe("23505");
  });
});

describe("RLS: anon key is denied on every table", () => {
  for (const table of ["supporters", "verification_tokens", "email_events"]) {
    it(`blocks anon select on ${table}`, async () => {
      const { data, error } = await anon.from(table).select("*").limit(1);
      expect(error).not.toBeNull();
      expect(data).toBeNull();
    });
  }

  it("blocks anon insert on supporters", async () => {
    const { error } = await anon
      .from("supporters")
      .insert(newSupporter(anonInsertEmail));
    expect(error).not.toBeNull();
  });

  it("blocks anon insert on verification_tokens", async () => {
    const { error } = await anon.from("verification_tokens").insert({
      supporter_id: parentSupporterId,
      token_hash: "\\xdeadbeef",
      expires_at: new Date(Date.now() + 60_000).toISOString(),
    });
    expect(error).not.toBeNull();
  });

  it("blocks anon insert on email_events", async () => {
    const { error } = await anon.from("email_events").insert({
      supporter_id: parentSupporterId,
      type: "delivered",
      provider_payload: {},
    });
    expect(error).not.toBeNull();
  });
});
