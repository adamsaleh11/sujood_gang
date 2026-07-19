import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  render,
  toPlainText,
} from "react-email";
import { siteCopy } from "@/lib/content/copy";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/email/send";
import { createUnsubscribeToken } from "@/lib/supporters/unsubscribe";

type ConfirmationMessage = {
  to: string;
  token: string;
  supporterId: string;
};

type WelcomeMessage = {
  to: string;
  referralCode: string;
  supporterId: string;
};

export async function sendConfirmationEmail({
  to,
  token,
}: ConfirmationMessage) {
  const verifyUrl = new URL("/verify", env.NEXT_PUBLIC_SITE_URL);
  verifyUrl.searchParams.set("token", token);

  const rendered = await renderSupporterEmail({
    preview: siteCopy.emails.confirmation.preview,
    heading: siteCopy.emails.confirmation.heading,
    body: siteCopy.emails.confirmation.body,
    ctaLabel: siteCopy.emails.confirmation.ctaLabel,
    ctaHref: verifyUrl.toString(),
    fallbackUrl: verifyUrl.toString(),
    footerNote: siteCopy.emails.confirmation.footerNote,
  });

  const result = await sendEmail({
    to,
    subject: siteCopy.emails.confirmation.subject,
    html: rendered.html,
    text: rendered.text,
  });
  if (!result.ok) throw new Error(result.message);
}

export async function sendWelcomeEmail({
  to,
  referralCode,
  supporterId,
}: WelcomeMessage) {
  const referralUrl = new URL("/", env.NEXT_PUBLIC_SITE_URL);
  referralUrl.searchParams.set("ref", referralCode);
  const unsubscribeUrl = new URL("/unsubscribe", env.NEXT_PUBLIC_SITE_URL);
  unsubscribeUrl.searchParams.set(
    "token",
    createUnsubscribeToken({ supporterId, email: to }, env.EMAIL_TOKEN_SECRET),
  );

  const rendered = await renderSupporterEmail({
    preview: siteCopy.emails.welcome.preview,
    heading: siteCopy.emails.welcome.heading,
    body: [
      ...siteCopy.emails.welcome.body,
      `Your referral link: ${referralUrl.toString()}`,
    ],
    ctaLabel: siteCopy.emails.welcome.ctaLabel,
    ctaHref: referralUrl.toString(),
    fallbackUrl: referralUrl.toString(),
    footerNote: siteCopy.emails.welcome.footerNote,
    unsubscribeUrl: unsubscribeUrl.toString(),
  });

  const result = await sendEmail({
    to,
    subject: siteCopy.emails.welcome.subject,
    html: rendered.html,
    text: rendered.text,
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl.toString()}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
  if (!result.ok) throw new Error(result.message);
}

export async function renderSupporterEmail(props: {
  preview: string;
  heading: string;
  body: string[];
  ctaLabel: string;
  ctaHref: string;
  fallbackUrl: string;
  footerNote: string;
  unsubscribeUrl?: string;
}) {
  const html = await render(<SupporterEmail {...props} />);
  return { html, text: toPlainText(html) };
}

function SupporterEmail({
  preview,
  heading,
  body,
  ctaLabel,
  ctaHref,
  fallbackUrl,
  footerNote,
  unsubscribeUrl,
}: {
  preview: string;
  heading: string;
  body: string[];
  ctaLabel: string;
  ctaHref: string;
  fallbackUrl: string;
  footerNote: string;
  unsubscribeUrl?: string;
}) {
  const identity = [
    siteCopy.pendingClient.legalName,
    siteCopy.pendingClient.address,
    siteCopy.pendingClient.contactEmail,
  ].filter(Boolean);

  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>{siteCopy.brand.name}</Text>
          <Heading style={styles.heading}>{heading}</Heading>
          {body.map((paragraph) => (
            <Text key={paragraph} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
          <Section style={styles.ctaSection}>
            <Button href={ctaHref} style={styles.button}>
              {ctaLabel}
            </Button>
          </Section>
          <Text style={styles.fallback}>
            If the button does not work, open this link:{" "}
            <Link href={fallbackUrl}>{fallbackUrl}</Link>
          </Text>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>{footerNote}</Text>
          <Text style={styles.footer}>
            {identity.length > 0 ? identity.join(" | ") : "PENDING_CLIENT"}
          </Text>
          {unsubscribeUrl ? (
            <Text style={styles.footer}>
              <Link href={unsubscribeUrl}>Unsubscribe</Link>
            </Text>
          ) : null}
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    margin: 0,
    backgroundColor: "#f7f7f2",
    color: "#1c1c18",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "560px",
    margin: "0 auto",
    padding: "32px 24px",
    backgroundColor: "#ffffff",
  },
  brand: {
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0",
    color: "#4c5f21",
  },
  heading: {
    margin: "24px 0 16px",
    fontSize: "28px",
    lineHeight: "34px",
    color: "#1c1c18",
  },
  paragraph: {
    fontSize: "16px",
    lineHeight: "24px",
    color: "#34342e",
  },
  ctaSection: {
    margin: "28px 0",
  },
  button: {
    backgroundColor: "#4c5f21",
    borderRadius: "6px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "16px",
    fontWeight: 700,
    padding: "12px 18px",
    textDecoration: "none",
  },
  fallback: {
    fontSize: "13px",
    lineHeight: "20px",
    color: "#5f5f55",
  },
  hr: {
    borderColor: "#e2e2d8",
    margin: "28px 0 16px",
  },
  footer: {
    fontSize: "12px",
    lineHeight: "18px",
    color: "#737366",
  },
} as const;
