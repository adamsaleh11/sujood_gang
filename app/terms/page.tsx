import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { siteCopy } from "@/lib/content/copy";

export default function TermsPage() {
  const terms = siteCopy.legal.terms;

  return (
    <>
      <SiteHeader copy={siteCopy} />
      <main id="main" className="py-section flex-1 px-4 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-4xl">
          <Badge variant="outline" className="mb-6">
            {terms.reviewNotice}
          </Badge>
          <h1 className="text-display-sm">{terms.title}</h1>
          <p className="text-muted-foreground mt-5 max-w-3xl text-lg leading-8">
            {terms.intro}
          </p>
          <div className="mt-10 grid gap-4">
            {terms.sections.map((section) => (
              <section
                key={section.title}
                className="border-border bg-card shadow-soft rounded-lg border p-5"
              >
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <p className="text-muted-foreground mt-3 leading-7">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter copy={siteCopy} />
    </>
  );
}
