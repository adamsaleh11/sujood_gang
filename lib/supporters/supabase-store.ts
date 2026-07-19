import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  SupporterRecord,
  SupporterStore,
  VerificationTokenRecord,
} from "./signup-service";

type SupporterRow = {
  id: string;
  email_normalized: string;
  status: "pending" | "verified" | "unsubscribed";
  personal_referral_code: string | null;
  verified_at?: string | null;
  unsubscribed_at?: string | null;
  suppressed_at?: string | null;
  suppression_reason?: "hard_bounce" | "complained" | null;
};

type TokenRow = {
  id: string;
  supporter_id: string;
  token_hash: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
};

export function createSupabaseSupporterStore(
  supabase: SupabaseClient,
): SupporterStore {
  return {
    async findSupporterByEmail(email) {
      const { data, error } = await supabase
        .from("supporters")
        .select(SUPPORTER_SELECT)
        .eq("email_normalized", email)
        .maybeSingle<SupporterRow>();
      if (error) throw error;
      return data ? mapSupporter(data) : null;
    },
    async createSupporter(row) {
      const { data, error } = await supabase
        .from("supporters")
        .insert({
          ...row,
          consent_at: row.consent_at.toISOString(),
        })
        .select(SUPPORTER_SELECT)
        .single<SupporterRow>();
      if (error) throw error;
      return mapSupporter(data);
    },
    async findVerifiedSupporterByReferralCode(code) {
      const { data, error } = await supabase
        .from("supporters")
        .select(SUPPORTER_SELECT)
        .eq("personal_referral_code", code)
        .eq("status", "verified")
        .maybeSingle<SupporterRow>();
      if (error) throw error;
      return data ? mapSupporter(data) : null;
    },
    async issueVerificationToken(row) {
      await supabase
        .from("verification_tokens")
        .update({ used_at: row.now.toISOString() })
        .eq("supporter_id", row.supporter_id)
        .is("used_at", null);

      const { error } = await supabase.from("verification_tokens").insert({
        supporter_id: row.supporter_id,
        token_hash: `\\x${row.token_hash}`,
        expires_at: row.expires_at.toISOString(),
      });
      if (error) throw error;
    },
    async markVerificationSent(params) {
      const { error } = await supabase
        .from("supporters")
        .update({
          verification_sent_at: params.verification_sent_at.toISOString(),
        })
        .eq("id", params.supporter_id);
      if (error) throw error;
    },
    async findVerificationTokenByHash(tokenHash) {
      const { data, error } = await supabase
        .from("verification_tokens")
        .select("id,supporter_id,token_hash,expires_at,used_at,created_at")
        .eq("token_hash", `\\x${tokenHash}`)
        .maybeSingle<TokenRow>();
      if (error) throw error;
      return data ? mapToken(data) : null;
    },
    async countVerificationTokensSince(supporterId, since) {
      const { count, error } = await supabase
        .from("verification_tokens")
        .select("id", { count: "exact", head: true })
        .eq("supporter_id", supporterId)
        .gte("created_at", since.toISOString());
      if (error) throw error;
      return count ?? 0;
    },
    async findSupporterById(id) {
      const { data, error } = await supabase
        .from("supporters")
        .select(SUPPORTER_SELECT)
        .eq("id", id)
        .maybeSingle<SupporterRow>();
      if (error) throw error;
      return data ? mapSupporter(data) : null;
    },
    async markSupporterVerified(params) {
      const { data: existing, error: readError } = await supabase
        .from("supporters")
        .select(SUPPORTER_SELECT)
        .eq("id", params.supporter_id)
        .single<SupporterRow>();
      if (readError) throw readError;

      const referralCode =
        existing.personal_referral_code ?? params.personal_referral_code;

      const { data, error } = await supabase
        .from("supporters")
        .update({
          status: "verified",
          verified_at: params.verified_at.toISOString(),
          personal_referral_code: referralCode,
        })
        .eq("id", params.supporter_id)
        .select(SUPPORTER_SELECT)
        .single<SupporterRow>();
      if (error) throw error;

      const { error: tokenError } = await supabase
        .from("verification_tokens")
        .update({ used_at: params.verified_at.toISOString() })
        .eq("id", params.token_id);
      if (tokenError) throw tokenError;

      return mapSupporter(data);
    },
    async unsubscribeSupporter(params) {
      const { error } = await supabase
        .from("supporters")
        .update({
          status: "unsubscribed",
          unsubscribed_at: params.unsubscribed_at.toISOString(),
        })
        .eq("id", params.supporter_id);
      if (error) throw error;
    },
    async suppressSupporter(params) {
      const { error } = await supabase
        .from("supporters")
        .update({
          suppressed_at: params.suppressed_at.toISOString(),
          suppression_reason: params.suppression_reason,
        })
        .eq("id", params.supporter_id);
      if (error) throw error;
    },
    async isSuppressed(supporterId) {
      const { data, error } = await supabase
        .from("supporters")
        .select("status,unsubscribed_at,suppressed_at")
        .eq("id", supporterId)
        .maybeSingle<
          Pick<SupporterRow, "status" | "unsubscribed_at" | "suppressed_at">
        >();
      if (error) throw error;
      return Boolean(
        data?.status === "unsubscribed" ||
        data?.unsubscribed_at ||
        data?.suppressed_at,
      );
    },
    async recordEmailEvent(row) {
      const { error } = await supabase.from("email_events").upsert(
        {
          supporter_id: row.supporter_id,
          type: row.type,
          provider_event_id: row.provider_event_id,
          provider_message_id: row.provider_message_id,
          email_normalized: row.email_normalized,
          provider_payload: row.provider_payload,
          created_at: row.created_at.toISOString(),
        },
        {
          onConflict: "provider_event_id",
          ignoreDuplicates: true,
        },
      );
      if (error) throw error;
    },
  };
}

const SUPPORTER_SELECT =
  "id,email_normalized,status,personal_referral_code,verified_at,unsubscribed_at,suppressed_at,suppression_reason";

function mapSupporter(row: SupporterRow): SupporterRecord {
  return {
    id: row.id,
    email_normalized: row.email_normalized,
    status: row.status,
    personal_referral_code: row.personal_referral_code,
    verified_at: row.verified_at ? new Date(row.verified_at) : undefined,
    unsubscribed_at: row.unsubscribed_at
      ? new Date(row.unsubscribed_at)
      : undefined,
    suppressed_at: row.suppressed_at ? new Date(row.suppressed_at) : undefined,
    suppression_reason: row.suppression_reason ?? undefined,
  };
}

function mapToken(row: TokenRow): VerificationTokenRecord {
  return {
    id: row.id,
    supporter_id: row.supporter_id,
    token_hash: row.token_hash,
    expires_at: new Date(row.expires_at),
    used_at: row.used_at ? new Date(row.used_at) : null,
    created_at: new Date(row.created_at),
  };
}
