import Link from "next/link";
import { Globe2, Mail } from "lucide-react";
import type { SiteCopy } from "@/lib/content/copy";

type SiteFooterProps = {
  copy: SiteCopy;
};

function PendingField({
  label,
  value,
  fallback,
}: {
  label: string;
  value: string;
  fallback: string;
}) {
  return (
    <p className="text-muted-foreground text-sm leading-6">
      <span className="text-foreground font-medium">{label}: </span>
      {value || fallback}
    </p>
  );
}

export function SiteFooter({ copy }: SiteFooterProps) {
  return (
    <footer className="border-border bg-background border-t px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_1fr_1fr]">
        <div>
          <p className="font-semibold">{copy.brand.name}</p>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-6">
            {copy.brand.tagline}
          </p>
        </div>
        <div>
          <p className="font-semibold">{copy.footer.organizationLabel}</p>
          <div className="mt-3 space-y-1">
            <PendingField
              label={copy.footer.legalNameLabel}
              value={copy.pendingClient.legalName}
              fallback={copy.footer.pendingLabel}
            />
            <PendingField
              label={copy.footer.addressLabel}
              value={copy.pendingClient.address}
              fallback={copy.footer.pendingLabel}
            />
            <PendingField
              label={copy.footer.contactEmailLabel}
              value={copy.pendingClient.contactEmail}
              fallback={copy.footer.pendingLabel}
            />
          </div>
        </div>
        <div>
          <p className="font-semibold">{copy.footer.contactLabel}</p>
          <nav
            aria-label={copy.accessibility.footerNavigation}
            className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm"
          >
            <Link
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg focus-visible:ring-3 focus-visible:outline-none"
              href={copy.footer.privacyLink.href}
            >
              {copy.footer.privacyLink.label}
            </Link>
            <Link
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg focus-visible:ring-3 focus-visible:outline-none"
              href={copy.footer.termsLink.href}
            >
              {copy.footer.termsLink.label}
            </Link>
            <Link
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg focus-visible:ring-3 focus-visible:outline-none"
              href={copy.footer.manageLink.href}
            >
              {copy.footer.manageLink.label}
            </Link>
          </nav>
          <nav
            aria-label={copy.accessibility.socialLinks}
            className="mt-5 flex gap-3"
          >
            {copy.pendingClient.socialUrls.length > 0 ? (
              copy.pendingClient.socialUrls.map((url) => (
                <Link
                  key={url}
                  href={url}
                  className="border-border text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring/50 inline-flex size-11 items-center justify-center rounded-lg border focus-visible:ring-3 focus-visible:outline-none"
                >
                  <Globe2 aria-hidden="true" />
                </Link>
              ))
            ) : (
              <span className="text-muted-foreground inline-flex min-h-11 items-center gap-2 text-sm">
                <Mail aria-hidden="true" className="size-4" />
                {copy.footer.pendingLabel}
              </span>
            )}
          </nav>
        </div>
      </div>
    </footer>
  );
}
