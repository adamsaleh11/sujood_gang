import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { siteCopy } from "@/lib/content/copy";

export default function PrivacyPage() {
  const privacy = siteCopy.legal.privacy;

  return (
    <>
      <SiteHeader copy={siteCopy} />
      <main id="main" className="py-section flex-1 px-4 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-4xl">
          <Badge variant="outline" className="mb-6">
            {privacy.reviewNotice}
          </Badge>
          <h1 className="text-display-sm">{privacy.title}</h1>
          <p className="text-muted-foreground mt-5 max-w-3xl text-lg leading-8">
            {privacy.intro}
          </p>
          <section className="border-border bg-card shadow-soft mt-10 rounded-lg border">
            <div className="border-border border-b p-5">
              <h2 className="text-2xl font-semibold">
                {privacy.fieldPurposeTitle}
              </h2>
            </div>
            <div className="divide-border divide-y">
              {privacy.fields.map((field) => (
                <div
                  key={field.name}
                  className="grid gap-2 p-5 sm:grid-cols-[0.32fr_1fr]"
                >
                  <h3 className="font-semibold">{field.name}</h3>
                  <p className="text-muted-foreground leading-7">
                    {field.purpose}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
      <SiteFooter copy={siteCopy} />
    </>
  );
}
