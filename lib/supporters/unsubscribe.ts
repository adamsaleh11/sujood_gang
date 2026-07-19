import { createHmac, timingSafeEqual } from "node:crypto";

export type UnsubscribeTokenPayload = {
  supporterId: string;
  email: string;
};

export function createUnsubscribeToken(
  payload: UnsubscribeTokenPayload,
  secret: string,
) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );
  const signature = sign(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export function parseUnsubscribeToken(
  token: string,
  secret: string,
): UnsubscribeTokenPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = sign(encodedPayload, secret);
  if (!safeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<UnsubscribeTokenPayload>;
    if (!payload.supporterId || !payload.email) return null;
    return {
      supporterId: payload.supporterId,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}
