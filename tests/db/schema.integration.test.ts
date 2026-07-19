import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve(
    __dirname,
    "../../supabase/migrations/20260719015804_init_supporters_schema.sql",
  ),
  "utf8",
);

function compactSql(sql: string) {
  return sql.replace(/\s+/g, " ").trim().toLowerCase();
}

function tableDefinition(tableName: string) {
  const match = migration.match(
    new RegExp(`create table public\\.${tableName} \\((.*?)\\);`, "is"),
  );
  if (!match?.[1]) {
    throw new Error(`Missing public.${tableName} table definition`);
  }
  return compactSql(match[1]);
}

const sql = compactSql(migration);

describe("supporters schema migration contract", () => {
  it("keeps email_normalized unique at the database level", () => {
    expect(tableDefinition("supporters")).toContain(
      "email_normalized text not null unique",
    );
  });

  it("keeps verification tokens bound to supporters with token hash lookup", () => {
    const tokens = tableDefinition("verification_tokens");

    expect(tokens).toContain(
      "supporter_id uuid not null references public.supporters (id) on delete cascade",
    );
    expect(tokens).toContain("token_hash bytea not null");
    expect(sql).toContain(
      "create index verification_tokens_token_hash_idx on public.verification_tokens (token_hash)",
    );
  });

  it("keeps email events bound to supporters", () => {
    const events = tableDefinition("email_events");

    expect(events).toContain(
      "supporter_id uuid not null references public.supporters (id) on delete cascade",
    );
    expect(events).toContain("type public.email_event_type not null");
    expect(events).toContain("provider_payload jsonb");
  });

  it("enables RLS on every app-owned table", () => {
    for (const table of [
      "supporters",
      "verification_tokens",
      "email_events",
      "rate_limit_events",
    ]) {
      expect(sql).toContain(
        `alter table public.${table} enable row level security`,
      );
    }
  });

  it("keeps anon and authenticated roles denied on every app-owned table", () => {
    for (const table of [
      "supporters",
      "verification_tokens",
      "email_events",
      "rate_limit_events",
    ]) {
      expect(sql).toContain(
        `revoke all on public.${table} from anon, authenticated`,
      );
    }
  });

  it("grants server-side access to the Supabase service role", () => {
    expect(sql).toContain("grant usage on schema public to service_role");

    for (const table of [
      "supporters",
      "verification_tokens",
      "email_events",
      "rate_limit_events",
    ]) {
      expect(sql).toContain(`grant all on public.${table} to service_role`);
    }
  });
});
