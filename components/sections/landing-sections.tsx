import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Package, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SupporterSignupForm } from "@/components/forms/supporter-signup-form";
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
        render={<Link href={copy.hero.primaryCta.href} />}
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

function HeroMedia({ copy }: LandingPageProps) {
  const video = copy.hero.video;

  return (
    <div className="relative mx-auto grid w-full max-w-xl grid-cols-5 gap-4 lg:max-w-none">
      <div className="col-span-3 flex flex-col gap-4">
        <div className="border-border bg-card shadow-card relative aspect-[1.08] overflow-hidden rounded-lg border">
          <Image
            src={video.posterSrc}
            alt={copy.hero.posterAlt}
            fill
            priority
            sizes="(min-width: 1024px) 22vw, 58vw"
            className="object-cover"
          />
          {video.enabled ? (
            <video
              className="absolute inset-0 size-full object-cover"
              poster={video.posterSrc}
              preload="none"
              controls
              aria-label={video.controlsLabel}
            >
              {video.sources.map((source) => (
                <source key={source.src} src={source.src} type={source.type} />
              ))}
              <track src={video.captionsSrc} kind="captions" />
            </video>
          ) : null}
        </div>
        <div className="border-border bg-secondary/70 shadow-soft hidden aspect-[1.08] rounded-lg border sm:block" />
      </div>
      <div className="border-border bg-secondary shadow-card col-span-2 min-h-full rounded-lg border" />
    </div>
  );
}

function HeroSection({ copy }: LandingPageProps) {
  return (
    <section className="bg-dot-grid px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
        <div className="max-w-3xl">
          <Badge variant="outline" className="bg-background/80 mb-6">
            {copy.hero.badgeLabel}
          </Badge>
          <p className="text-primary mb-5 max-w-xl text-sm font-medium uppercase">
            {copy.hero.mission}
          </p>
          <h1 className="text-display max-w-4xl">{copy.hero.headline}</h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
            {copy.hero.supportingLine}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href={copy.hero.primaryCta.href} />}
              className="min-h-12 px-5"
            >
              {copy.hero.primaryCta.label}
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href={copy.hero.secondaryCta.href} />}
              className="min-h-12 px-5"
            >
              {copy.hero.secondaryCta.label}
              <PlayCircle aria-hidden="true" />
            </Button>
          </div>
        </div>
        <HeroMedia copy={copy} />
      </div>
    </section>
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
        <SectionIntro copy={copy.memberBenefitsIntro} align="center" />
        <SectionCta copy={copy} align="center" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

function CommunityEvidenceGrid({
  evidence,
}: {
  evidence: CommunityEvidence[];
}) {
  if (evidence.length === 0) {
    return null;
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
        <CommunityEvidenceGrid evidence={communityEvidence} />
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
              render={<Link href={copy.hero.primaryCta.href} />}
              className="min-h-12 px-5"
            >
              {copy.hero.primaryCta.label}
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href={copy.merchandise.notifyCta.href} />}
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
        </div>
        <div className="border-border bg-secondary/70 rounded-lg border p-5 sm:p-6">
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
          <SectionCta copy={copy} />
        </div>
        <FaqAccordion faqs={copy.faq} />
      </div>
    </section>
  );
}

export function LandingSections({ copy }: LandingPageProps) {
  return (
    <>
      <HeroSection copy={copy} />
      <StorySection copy={copy} />
      <VisionSection copy={copy} />
      <BenefitsSection copy={copy} />
      <CommunitySection copy={copy} />
      <MerchandiseSection copy={copy} />
      <JoinSection copy={copy} />
      <FaqSection copy={copy} />
    </>
  );
}
