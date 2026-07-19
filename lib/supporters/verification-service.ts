import { randomBytes as nodeRandomBytes } from "node:crypto";
import type { SupporterStore } from "./signup-service";
import { hashToken } from "./signup-service";

export type VerifySupporterResult =
  | { state: "success"; referralCode: string }
  | { state: "already_verified"; referralCode: string | null }
  | { state: "expired" }
  | { state: "invalid" };

export type VerificationServiceDependencies = {
  store: SupporterStore;
  sendWelcomeEmail?: (message: {
    to: string;
    referralCode: string;
    supporterId: string;
  }) => Promise<void>;
  now?: () => Date;
  randomBytes?: (size: number) => Buffer;
};

export function createSupporterVerificationService({
  store,
  sendWelcomeEmail = async () => {},
  now = () => new Date(),
  randomBytes = nodeRandomBytes,
}: VerificationServiceDependencies) {
  return {
    async verifySupporter(rawToken: string): Promise<VerifySupporterResult> {
      if (!rawToken) return { state: "invalid" };
      const token = await store.findVerificationTokenByHash?.(
        hashToken(rawToken),
      );
      if (!token) return { state: "invalid" };

      const supporter = await store.findSupporterById?.(token.supporter_id);
      if (!supporter) return { state: "invalid" };
      if (supporter.status === "verified") {
        return {
          state: "already_verified",
          referralCode: supporter.personal_referral_code,
        };
      }
      if (token.used_at) {
        return { state: "invalid" };
      }
      if (token.expires_at.getTime() <= now().getTime()) {
        return { state: "expired" };
      }

      const generatedCode = createReferralCode(randomBytes);
      const verified = await store.markSupporterVerified?.({
        token_id: token.id,
        supporter_id: supporter.id,
        verified_at: now(),
        personal_referral_code: generatedCode,
      });
      if (!verified) return { state: "invalid" };

      await sendWelcomeEmail({
        to: verified.email_normalized,
        referralCode: verified.personal_referral_code ?? generatedCode,
        supporterId: verified.id,
      });

      return {
        state: "success",
        referralCode: verified.personal_referral_code ?? generatedCode,
      };
    },
  };
}

export function createReferralCode(randomBytes: (size: number) => Buffer) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  let code = "";
  for (const byte of bytes) {
    code += alphabet[byte % alphabet.length];
  }
  return code;
}
