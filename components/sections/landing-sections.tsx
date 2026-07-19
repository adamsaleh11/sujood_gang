import Image from "next/image";
import {
  ArrowRight,
  Check,
  CircleCheck,
  Mail,
  MailCheck,
  Package,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { SupporterSignupForm } from "@/components/forms/supporter-signup-form";
import { FunnelPageTracker } from "@/components/analytics/funnel-page-tracker";
import { InteractiveHeroShell } from "@/components/sections/interactive-hero-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import type { EditorialSectionCopy, SiteCopy } from "@/lib/content/copy";
import { COUNTRY_CODES } from "@/lib/validation/countries";

type LandingPageProps = {
  copy: SiteCopy;
};

type SectionIntroProps = {
  copy: EditorialSectionCopy;
  align?: "left" | "center";
};

type CommunityEvidence = {
  id: string;
  quote?: string;
  attribution?: string;
  imageSrc?: string;
  imageAlt?: string;
};

const communityEvidence: CommunityEvidence[] = [];
const stepIcons = [CircleCheck, MailCheck, ShieldCheck] as const;
const heroVerseArabic =
  "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ ٢٥٥";
const heroVerseTranslation =
  "Allah! There is no god ˹worthy of worship˺ except Him, the Ever-Living, All-Sustaining. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and whatever is on the earth. Who could possibly intercede with Him without His permission? He ˹fully˺ knows what is ahead of them and what is behind them, but no one can grasp any of His knowledge—except what He wills ˹to reveal˺. His Seat encompasses the heavens and the earth, and the preservation of both does not tire Him. For He is the Most High, the Greatest.";

function SectionCta({
  copy,
  align = "left",
  surface = "light",
}: LandingPageProps & {
  align?: "left" | "center";
  surface?: "light" | "dark";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mt-8 flex justify-center"
          : "mt-8 flex justify-start"
      }
    >
      <Button
        size="lg"
        nativeButton={false}
        render={
          <TrackedLink
            href={copy.hero.primaryCta.href}
            eventName="primary_cta_clicked"
            eventProperties={{ placement: "section_cta" }}
          />
        }
        className={
          surface === "dark"
            ? "bg-lime text-lime-foreground hover:bg-lime/90 min-h-12 px-5"
            : "min-h-12 px-5"
        }
      >
        {copy.hero.primaryCta.label}
        <ArrowRight aria-hidden="true" />
      </Button>
    </div>
  );
}

function SectionIntro({ copy, align = "left" }: SectionIntroProps) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl text-left"
      }
    >
      <p className="text-primary mb-3 text-sm font-semibold uppercase">
        {copy.eyebrow}
      </p>
      <h2 className="text-display-sm">{copy.title}</h2>
      <p className="text-muted-foreground mt-5 text-base leading-8 sm:text-lg">
        {copy.body}
      </p>
    </div>
  );
}

function HeroVerseArabic() {
  return (
    <figure className="pointer-events-auto relative z-[1] mx-auto max-w-7xl">
      <blockquote
        dir="rtl"
        lang="ar"
        aria-label="Ayat al-Kursi Arabic"
        className="hero-verse-segment mx-auto max-w-6xl text-center text-sm leading-8 text-background/88 sm:text-base sm:leading-9 lg:text-lg lg:leading-10"
      >
        {heroVerseArabic}
      </blockquote>
    </figure>
  );
}

function HeroVerseTranslation() {
  return (
    <figcaption
      lang="en"
      aria-label="Ayat al-Kursi English translation"
      className="font-scripture hero-verse-segment pointer-events-auto relative z-[1] mx-auto max-w-6xl text-center text-xs leading-6 text-background/78 sm:text-sm sm:leading-7 lg:text-[0.95rem] lg:leading-8"
    >
      {heroVerseTranslation}
    </figcaption>
  );
}

function HeroSection({ copy }: LandingPageProps) {
  return (
    <InteractiveHeroShell>
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-3 text-center">
        <HeroVerseArabic />
        <div className="pointer-events-none mx-auto flex w-full max-w-7xl flex-col items-center justify-center text-center">
          <div className="pointer-events-none max-w-4xl">
          <Image
            src="/images/logo.png"
            alt={copy.brand.name}
            width={88}
            height={88}
            priority
            className="shadow-soft mx-auto mb-6 rounded-full"
          />
          <Badge className="bg-lime text-lime-foreground mb-6">
            {copy.hero.badgeLabel}
          </Badge>
          <p className="text-lime mx-auto mb-5 max-w-2xl text-sm font-medium uppercase">
            {copy.hero.mission}
          </p>
          <h1 className="text-display mx-auto max-w-4xl">
            {copy.hero.headline}
          </h1>
          <p className="text-background/78 mx-auto mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
            {copy.hero.supportingLine}
          </p>
          <div
            className="pointer-events-auto mx-auto mt-8 flex w-fit flex-col justify-center gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              nativeButton={false}
              render={
                <TrackedLink
                  href={copy.hero.primaryCta.href}
                  eventName="primary_cta_clicked"
                  eventProperties={{ placement: "hero" }}
                />
              }
              className="bg-lime text-lime-foreground hover:bg-lime/90 min-h-12 px-5"
            >
              {copy.hero.primaryCta.label}
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              nativeButton={false}
              render={
                <TrackedLink
                  href={copy.hero.secondaryCta.href}
                  eventName="secondary_cta_clicked"
                  eventProperties={{ placement: "hero" }}
                />
              }
              className="bg-lime text-lime-foreground hover:bg-lime/90 min-h-12 px-5"
            >
              {copy.hero.secondaryCta.label}
              <PlayCircle aria-hidden="true" />
            </Button>
          </div>
          <ul className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            {copy.hero.proofPoints.map((point) => (
              <li
                key={point.id}
                className="border-background/18 bg-background/12 text-background flex min-h-12 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium shadow-soft"
              >
                <Check aria-hidden="true" className="text-lime size-4" />
                {point.label}
              </li>
            ))}
          </ul>
          </div>
        </div>
        <HeroVerseTranslation />
      </div>
    </InteractiveHeroShell>
  );
}

function StorySection({ copy }: LandingPageProps) {
  return (
    <section id="mission" className="py-section px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div className="border-border bg-card shadow-soft rounded-lg border p-6 sm:p-8">
          <Image
            src="/images/logo.png"
            alt={copy.brand.name}
            width={104}
            height={104}
            className="shadow-soft mb-8 rounded-full"
          />
          <p className="text-2xl leading-tight font-semibold sm:text-3xl">
            {copy.brand.tagline}
          </p>
        </div>
        <div>
          <SectionIntro copy={copy.strengthThroughSubmission} />
          <SectionCta copy={copy} />
        </div>
      </div>
    </section>
  );
}

function VisionSection({ copy }: LandingPageProps) {
  return (
    <section
      id="vision"
      className="bg-foreground py-section text-background px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.7fr] lg:items-center">
        <div>
          <p className="text-lime mb-3 text-sm font-semibold uppercase">
            {copy.vision.eyebrow}
          </p>
          <h2 className="text-display-sm">{copy.vision.title}</h2>
          <p className="text-background/76 mt-5 max-w-3xl text-base leading-8 sm:text-lg">
            {copy.vision.body}
          </p>
          <SectionCta copy={copy} surface="dark" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {copy.memberBenefits.slice(0, 2).map((benefit) => (
            <div
              key={benefit.id}
              className="border-background/15 bg-background/8 rounded-lg border p-5"
            >
              <Check aria-hidden="true" className="text-lime mb-4 size-5" />
              <h3 className="font-semibold">{benefit.title}</h3>
              <p className="text-background/68 mt-2 text-sm leading-6">
                {benefit.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection({ copy }: LandingPageProps) {
  return (
    <section className="py-section px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.memberBenefits.map((benefit) => (
            <article
              key={benefit.id}
              className="border-border bg-card shadow-soft rounded-lg border p-5"
            >
              <Check aria-hidden="true" className="text-primary mb-5 size-5" />
              <h3 className="text-lg font-semibold">{benefit.title}</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-6">
                {benefit.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupporterPathSection({ copy }: LandingPageProps) {
  return (
    <section className="bg-secondary/70 py-section px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionIntro copy={copy.supporterPath} align="center" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {copy.supporterPath.steps.map((step, index) => {
            const Icon = stepIcons[index] ?? CircleCheck;

            return (
              <article
                key={step.id}
                className="border-border bg-card shadow-soft rounded-lg border p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg text-sm font-semibold">
                    {index + 1}
                  </span>
                  <Icon aria-hidden="true" className="text-primary size-5" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground mt-3 text-sm leading-6">
                  {step.body}
                </p>
              </article>
            );
          })}
        </div>
        <SectionCta copy={copy} align="center" />
      </div>
    </section>
  );
}

function CommunityEvidenceGrid({
  evidence,
  emptyStateLabel,
}: {
  evidence: CommunityEvidence[];
  emptyStateLabel: string;
}) {
  if (evidence.length === 0) {
    return (
      <div className="border-border bg-card shadow-soft mx-auto mt-10 max-w-2xl rounded-lg border p-6 text-center">
        <ShieldCheck
          aria-hidden="true"
          className="text-primary mx-auto size-6"
        />
        <p className="mt-4 font-semibold">{emptyStateLabel}</p>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Supporter moments, testimonials, and counts should be added only after
          they can be verified.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-4 md:grid-cols-3">
      {evidence.map((entry) => (
        <article
          key={entry.id}
          className="border-border bg-card shadow-soft rounded-lg border p-5"
        >
          {entry.imageSrc && entry.imageAlt ? (
            <Image
              src={entry.imageSrc}
              alt={entry.imageAlt}
              width={320}
              height={220}
              className="mb-5 aspect-[1.45] rounded-lg object-cover"
            />
          ) : null}
          {entry.quote ? (
            <p className="text-muted-foreground text-sm leading-6">
              {entry.quote}
            </p>
          ) : null}
          {entry.attribution ? (
            <p className="mt-4 text-sm font-semibold">{entry.attribution}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function CommunitySection({ copy }: LandingPageProps) {
  return (
    <section
      id="community"
      className="bg-secondary/70 py-section px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionIntro copy={copy.community} align="center" />
        <SectionCta copy={copy} align="center" />
        <CommunityEvidenceGrid
          evidence={communityEvidence}
          emptyStateLabel={copy.community.emptyStateLabel}
        />
      </div>
    </section>
  );
}

function MerchandiseSection({ copy }: LandingPageProps) {
  return (
    <section id="merchandise" className="py-section px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3 space-y-4">
            <div className="border-border bg-foreground text-background shadow-card flex aspect-[1.1] items-end rounded-lg border p-5">
              <Package aria-hidden="true" className="text-lime size-8" />
            </div>
            <div className="border-border bg-secondary shadow-soft aspect-[1.45] rounded-lg border" />
          </div>
          <div className="border-border bg-card shadow-card col-span-2 rounded-lg border p-4">
            <p className="sr-only">{copy.merchandise.imageAlt}</p>
            <div className="flex h-full flex-col justify-end gap-3">
              {copy.merchandise.items.map((item) => (
                <div key={item.id} className="border-border border-t pt-3">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <Badge variant="secondary" className="mt-2">
                    {copy.merchandise.upcomingLabel}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <SectionIntro copy={copy.merchandise} />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              render={
                <TrackedLink
                  href={copy.hero.primaryCta.href}
                  eventName="primary_cta_clicked"
                  eventProperties={{ placement: "merchandise" }}
                />
              }
              className="min-h-12 px-5"
            >
              {copy.hero.primaryCta.label}
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={
                <TrackedLink
                  href={copy.merchandise.notifyCta.href}
                  eventName="secondary_cta_clicked"
                  eventProperties={{ placement: "merchandise_notify" }}
                />
              }
              className="min-h-12 px-5"
            >
              {copy.merchandise.notifyCta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function JoinSection({ copy }: LandingPageProps) {
  return (
    <section id="join" className="py-section px-4 sm:px-6 lg:px-8">
      <div className="border-border bg-card shadow-card mx-auto grid max-w-7xl gap-8 rounded-lg border p-6 sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
        <div>
          <p className="text-primary mb-3 text-sm font-semibold uppercase">
            {copy.join.eyebrow}
          </p>
          <h2 className="text-display-sm">{copy.join.title}</h2>
          <p className="text-muted-foreground mt-5 text-base leading-8 sm:text-lg">
            {copy.join.body}
          </p>
          <div className="mt-8 grid gap-3">
            {copy.hero.proofPoints.map((point) => (
              <div
                key={point.id}
                className="border-border bg-background/70 flex min-h-12 items-center gap-3 rounded-lg border px-4 text-sm font-medium"
              >
                <Check aria-hidden="true" className="text-primary size-4" />
                {point.label}
              </div>
            ))}
          </div>
        </div>
        <div className="border-border bg-secondary/70 rounded-lg border p-5 sm:p-6">
          <Mail aria-hidden="true" className="text-primary mb-5 size-6" />
          <p className="text-lg font-semibold">{copy.join.formIntro}</p>
          <p className="text-muted-foreground mt-4 leading-7">
            {copy.join.confirmationExpectation}
          </p>
          <div className="mt-6">
            <SupporterSignupForm
              copy={copy.join.form}
              countryCodes={COUNTRY_CODES}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection({ copy }: LandingPageProps) {
  return (
    <section
      id="faq"
      aria-label={copy.accessibility.faqRegion}
      className="bg-secondary/70 py-section px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.55fr_1fr]">
        <div>
          <p className="text-primary mb-3 text-sm font-semibold uppercase">
            {copy.accessibility.faqRegion}
          </p>
          <h2 className="text-display-sm">{copy.accessibility.faqRegion}</h2>
        </div>
        <FaqAccordion faqs={copy.faq} />
      </div>
    </section>
  );
}

export function LandingSections({ copy }: LandingPageProps) {
  return (
    <>
      <FunnelPageTracker />
      <HeroSection copy={copy} />
      <StorySection copy={copy} />
      <SupporterPathSection copy={copy} />
      <VisionSection copy={copy} />
      <BenefitsSection copy={copy} />
      <CommunitySection copy={copy} />
      <MerchandiseSection copy={copy} />
      <JoinSection copy={copy} />
      <FaqSection copy={copy} />
    </>
  );
}
