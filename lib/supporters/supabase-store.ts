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
