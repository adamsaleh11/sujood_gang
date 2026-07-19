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
  unsubscribed_at?: string | null;
};

type TokenRow = {
  id: string;
  supporter_id: string;
  token_hash: string;
  expires_at: string;
  used_at: string | null;
};

export function createSupabaseSupporterStore(
  supabase: SupabaseClient,
): SupporterStore {
  return {
    async findSupporterByEmail(email) {
      const { data, error } = await supabase
        .from("supporters")
        .select("id,email_normalized,status,personal_referral_code")
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
          verification_sent_at: row.verification_sent_at.toISOString(),
        })
        .select("id,email_normalized,status,personal_referral_code")
        .single<SupporterRow>();
      if (error) throw error;
      return mapSupporter(data);
    },
    async findVerifiedSupporterByReferralCode(code) {
      const { data, error } = await supabase
        .from("supporters")
        .select("id,email_normalized,status,personal_referral_code")
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
    async countVerificationTokensSince(params) {
      const { count, error } = await supabase
        .from("verification_tokens")
        .select("id", { count: "exact", head: true })
        .eq("supporter_id", params.supporter_id)
        .gte("created_at", params.since.toISOString());
      if (error) throw error;
      return count ?? 0;
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
          status: "unsubscribed",
          unsubscribed_at: params.suppressed_at.toISOString(),
        })
        .eq("id", params.supporter_id);
      if (error) throw error;
    },
    async isSuppressed(supporterId) {
      const { data, error } = await supabase
        .from("supporters")
        .select("status,unsubscribed_at")
        .eq("id", supporterId)
        .maybeSingle<Pick<SupporterRow, "status" | "unsubscribed_at">>();
      if (error) throw error;
      return Boolean(data?.unsubscribed_at || data?.status === "unsubscribed");
    },
    async recordEmailEvent(row) {
      if (!row.supporter_id) return;
      const { error } = await supabase.from("email_events").insert({
        supporter_id: row.supporter_id,
        type: row.type,
        provider_payload: row.provider_payload ?? null,
        created_at: row.created_at.toISOString(),
      });
      if (error) throw error;
    },
    async findVerificationTokenByHash(tokenHash) {
      const { data, error } = await supabase
        .from("verification_tokens")
        .select("id,supporter_id,token_hash,expires_at,used_at")
        .eq("token_hash", `\\x${tokenHash}`)
        .maybeSingle<TokenRow>();
      if (error) throw error;
      return data ? mapToken(data) : null;
    },
    async findSupporterById(id) {
      const { data, error } = await supabase
        .from("supporters")
        .select("id,email_normalized,status,personal_referral_code")
        .eq("id", id)
        .maybeSingle<SupporterRow>();
      if (error) throw error;
      return data ? mapSupporter(data) : null;
    },
    async markSupporterVerified(params) {
      const { data: existing, error: readError } = await supabase
        .from("supporters")
        .select("id,email_normalized,status,personal_referral_code")
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
        .select("id,email_normalized,status,personal_referral_code")
        .single<SupporterRow>();
      if (error) throw error;

      const { error: tokenError } = await supabase
        .from("verification_tokens")
        .update({ used_at: params.verified_at.toISOString() })
        .eq("id", params.token_id);
      if (tokenError) throw tokenError;

      return mapSupporter(data);
    },
  };
}

function mapSupporter(row: SupporterRow): SupporterRecord {
  return {
    id: row.id,
    email_normalized: row.email_normalized,
    status: row.status,
    personal_referral_code: row.personal_referral_code,
    unsubscribed_at: row.unsubscribed_at
      ? new Date(row.unsubscribed_at)
      : undefined,
  };
}

function mapToken(row: TokenRow): VerificationTokenRecord {
  return {
    id: row.id,
    supporter_id: row.supporter_id,
    token_hash: row.token_hash,
    expires_at: new Date(row.expires_at),
    used_at: row.used_at ? new Date(row.used_at) : null,
  };
}
