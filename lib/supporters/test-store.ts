import type {
  EmailEventRecord,
  SupporterRecord,
  SupporterStore,
  VerificationTokenRecord,
} from "./signup-service";

export function createInMemorySupporterStore(): SupporterStore & {
  supporters: SupporterRecord[];
  tokens: VerificationTokenRecord[];
  emailEvents: EmailEventRecord[];
} {
  const supporters: SupporterRecord[] = [];
  const tokens: VerificationTokenRecord[] = [];
  const emailEvents: EmailEventRecord[] = [];

  return {
    supporters,
    tokens,
    emailEvents,
    async findSupporterByEmail(email) {
      return (
        supporters.find((supporter) => supporter.email_normalized === email) ??
        null
      );
    },
    async createSupporter(row) {
      const existing = supporters.find(
        (supporter) => supporter.email_normalized === row.email_normalized,
      );
      if (existing) return existing;

      const supporter: SupporterRecord = {
        id: `supporter-${supporters.length + 1}`,
        ...row,
        email_normalized: row.email_normalized,
        status: "pending",
        personal_referral_code: null,
      };
      supporters.push(supporter);
      return supporter;
    },
    async findVerifiedSupporterByReferralCode(code) {
      return (
        supporters.find(
          (supporter) =>
            supporter.status === "verified" &&
            supporter.personal_referral_code === code,
        ) ?? null
      );
    },
    async issueVerificationToken(row) {
      for (const token of tokens) {
        if (token.supporter_id === row.supporter_id && token.used_at === null) {
          token.used_at = row.now;
        }
      }
      tokens.push({
        id: `token-${tokens.length + 1}`,
        supporter_id: row.supporter_id,
        token_hash: row.token_hash,
        expires_at: row.expires_at,
        used_at: null,
        created_at: row.now,
      });
    },
    async markVerificationSent(params) {
      const supporter = supporters.find(
        (item) => item.id === params.supporter_id,
      );
      if (supporter) {
        supporter.verification_sent_at = params.verification_sent_at;
      }
    },
    async findVerificationTokenByHash(tokenHash) {
      return tokens.find((token) => token.token_hash === tokenHash) ?? null;
    },
    async countVerificationTokensSince(supporterId, since) {
      return tokens.filter(
        (token) =>
          token.supporter_id === supporterId &&
          token.created_at.getTime() >= since.getTime(),
      ).length;
    },
    async findSupporterById(id) {
      return supporters.find((supporter) => supporter.id === id) ?? null;
    },
    async markSupporterVerified(params) {
      const token = tokens.find((item) => item.id === params.token_id);
      if (token) token.used_at = params.verified_at;

      const supporter = supporters.find(
        (item) => item.id === params.supporter_id,
      );
      if (!supporter) {
        throw new Error(`Supporter not found: ${params.supporter_id}`);
      }
      supporter.status = "verified";
      supporter.personal_referral_code ??= params.personal_referral_code;
      supporter.verified_at = params.verified_at;
      return supporter;
    },
    async unsubscribeSupporter(params) {
      const supporter = supporters.find(
        (item) => item.id === params.supporter_id,
      );
      if (supporter) {
        supporter.status = "unsubscribed";
        supporter.unsubscribed_at = params.unsubscribed_at;
      }
    },
    async suppressSupporter(params) {
      const supporter = supporters.find(
        (item) => item.id === params.supporter_id,
      );
      if (supporter) {
        supporter.suppressed_at = params.suppressed_at;
        supporter.suppression_reason = params.suppression_reason;
      }
    },
    async isSuppressed(supporterId) {
      const supporter = supporters.find((item) => item.id === supporterId);
      return Boolean(
        supporter?.unsubscribed_at ||
        supporter?.suppressed_at ||
        supporter?.status === "unsubscribed",
      );
    },
    async recordEmailEvent(row) {
      if (
        row.provider_event_id &&
        emailEvents.some(
          (event) => event.provider_event_id === row.provider_event_id,
        )
      ) {
        return;
      }
      emailEvents.push({
        id: `email-event-${emailEvents.length + 1}`,
        ...row,
      });
    },
  };
}
