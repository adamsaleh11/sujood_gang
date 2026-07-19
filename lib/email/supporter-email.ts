import { siteCopy } from "@/lib/content/copy";
import { env } from "@/lib/env";

type ConfirmationMessage = {
  to: string;
  token: string;
};

type WelcomeMessage = {
  to: string;
  referralCode: string;
};

export async function sendConfirmationEmail({
  to,
  token,
}: ConfirmationMessage) {
  const verifyUrl = new URL("/verify", env.NEXT_PUBLIC_SITE_URL);
  verifyUrl.searchParams.set("token", token);

  await sendEmail({
    to,
    subject: siteCopy.emails.confirmation.subject,
    html: renderEmail({
      heading: siteCopy.emails.confirmation.heading,
      body: siteCopy.emails.confirmation.body,
      ctaLabel: siteCopy.emails.confirmation.ctaLabel,
      ctaHref: verifyUrl.toString(),
      footerNote: siteCopy.emails.confirmation.footerNote,
    }),
  });
}

export async function sendWelcomeEmail({ to, referralCode }: WelcomeMessage) {
  const referralUrl = new URL("/", env.NEXT_PUBLIC_SITE_URL);
  referralUrl.searchParams.set("ref", referralCode);

  await sendEmail({
    to,
    subject: siteCopy.emails.welcome.subject,
    html: renderEmail({
      heading: siteCopy.emails.welcome.heading,
      body: [
        ...siteCopy.emails.welcome.body,
        `Your referral link: ${referralUrl.toString()}`,
      ],
      ctaLabel: siteCopy.emails.welcome.ctaLabel,
      ctaHref: referralUrl.toString(),
      footerNote: siteCopy.emails.welcome.footerNote,
    }),
  });
}

async function sendEmail(message: {
  to: string;
  subject: string;
  html: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: message.to,
      subject: message.subject,
      html: message.html,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend email failed with ${response.status}`);
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function renderEmail({
  heading,
  body,
  ctaLabel,
  ctaHref,
  footerNote,
}: {
  heading: string;
  body: string[];
  ctaLabel: string;
  ctaHref: string;
  footerNote: string;
}) {
  const paragraphs = body
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
  return `<h1>${escapeHtml(heading)}</h1>${paragraphs}<p><a href="${ctaHref}">${escapeHtml(ctaLabel)}</a></p><p>${escapeHtml(footerNote)}</p>`;
}
