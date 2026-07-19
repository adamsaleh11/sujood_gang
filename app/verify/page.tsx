import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import {
  resendVerification,
  verifySupporter,
} from "@/lib/actions/create-supporter";
import { siteCopy } from "@/lib/content/copy";
import type { VerifySupporterResult } from "@/lib/supporters/verification-service";

export const metadata: Metadata = {
  title: siteCopy.systemPages.verify.metaTitle,
  robots: {
    index: false,
    follow: false,
  },
};

type VerifyPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { token } = await searchParams;
  const result: VerifySupporterResult = token
    ? await verifySupporter(token)
    : { state: "invalid" };
  const copy = siteCopy.systemPages.verify;

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <section
        aria-live="polite"
        className="flex w-full max-w-xl flex-col items-start gap-5"
      >
        {result.state === "success" ? (
          <>
            <p className="text-muted-foreground text-sm font-medium">
              {copy.successEyebrow}
            </p>
            <h1 className="text-3xl font-semibold tracking-normal">
              {copy.successTitle}
            </h1>
            <p className="text-muted-foreground">{copy.successBody}</p>
            <ReferralLink code={result.referralCode} />
          </>
        ) : null}

        {result.state === "already_verified" ? (
          <>
            <p className="text-muted-foreground text-sm font-medium">
              {copy.alreadyVerifiedEyebrow}
            </p>
            <h1 className="text-3xl font-semibold tracking-normal">
              {copy.alreadyVerifiedTitle}
            </h1>
            <p className="text-muted-foreground">{copy.alreadyVerifiedBody}</p>
            {result.referralCode ? (
              <ReferralLink code={result.referralCode} />
            ) : null}
          </>
        ) : null}

        {result.state === "expired" ? (
          <>
            <p className="text-muted-foreground text-sm font-medium">
              {copy.expiredEyebrow}
            </p>
            <h1 className="text-3xl font-semibold tracking-normal">
              {copy.expiredTitle}
            </h1>
            <p className="text-muted-foreground">{copy.expiredBody}</p>
            <form
              action={resendExpiredVerification}
              className="flex w-full gap-3"
            >
              <label className="sr-only" htmlFor="email">
                {copy.emailLabel}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="border-border min-h-11 flex-1 rounded-md border px-3"
                placeholder={copy.emailPlaceholder}
              />
              <Button type="submit">{copy.resendLabel}</Button>
            </form>
          </>
        ) : null}

        {result.state === "invalid" ? (
          <>
            <p className="text-muted-foreground text-sm font-medium">
              {copy.invalidEyebrow}
            </p>
            <h1 className="text-3xl font-semibold tracking-normal">
              {copy.invalidTitle}
            </h1>
            <p className="text-muted-foreground">{copy.invalidBody}</p>
            <Link className={buttonVariants()} href={copy.returnCta.href}>
              {copy.returnCta.label}
            </Link>
          </>
        ) : null}
      </section>
    </main>
  );
}

function ReferralLink({ code }: { code: string }) {
  const href = `/?ref=${encodeURIComponent(code)}`;
  return (
    <Link className={buttonVariants()} href={href}>
      {siteCopy.systemPages.verify.referralCtaLabel}
    </Link>
  );
}

async function resendExpiredVerification(formData: FormData) {
  "use server";

  const email = formData.get("email");
  if (typeof email === "string") {
    await resendVerification(email);
  }
}
