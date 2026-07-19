import { env } from "@/lib/env";

export type EmailSendErrorCode = "provider_rejected" | "network_error";

export type EmailSendResult =
  | { ok: true; providerMessageId: string | null }
  | {
      ok: false;
      code: EmailSendErrorCode;
      status?: number;
      message: string;
    };

export type SendEmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
};

export async function sendEmail(
  message: SendEmailMessage,
): Promise<EmailSendResult> {
  try {
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
        text: message.text,
        headers: message.headers,
      }),
    });

    const payload = (await response.json().catch(() => null)) as {
      id?: string;
      message?: string;
      error?: string;
    } | null;

    if (!response.ok) {
      const result = {
        ok: false,
        code: "provider_rejected",
        status: response.status,
        message:
          payload?.message ??
          payload?.error ??
          `Resend email failed with ${response.status}`,
      } as const;
      captureEmailError(result);
      return result;
    }

    return { ok: true, providerMessageId: payload?.id ?? null };
  } catch (error) {
    const result = {
      ok: false,
      code: "network_error",
      message: error instanceof Error ? error.message : "Email request failed",
    } as const;
    captureEmailError(result);
    return result;
  }
}

export function captureEmailError(
  error: Exclude<EmailSendResult, { ok: true }>,
) {
  console.error("Email send failed", error);
}
