import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LandingSections } from "@/components/sections/landing-sections";
import { siteCopy } from "@/lib/content/copy";

export default function Home() {
  return (
    <>
      <SiteHeader copy={siteCopy} />
      <main id="main" className="flex-1">
        <LandingSections copy={siteCopy} />
      </main>
      <SiteFooter copy={siteCopy} />
    </>
  );
}
