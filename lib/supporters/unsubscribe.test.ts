import { describe, expect, it } from "vitest";
import { createUnsubscribeToken, parseUnsubscribeToken } from "./unsubscribe";

const secret = "test-token-secret-test-token-secret";

describe("unsubscribe tokens", () => {
  it("round-trips a signed one-click unsubscribe token", () => {
    const token = createUnsubscribeToken(
      { supporterId: "supporter-1", email: "amara@example.com" },
      secret,
    );

    expect(parseUnsubscribeToken(token, secret)).toEqual({
      supporterId: "supporter-1",
      email: "amara@example.com",
    });
  });

  it("rejects tampered unsubscribe tokens", () => {
    const token = createUnsubscribeToken(
      { supporterId: "supporter-1", email: "amara@example.com" },
      secret,
    );

    expect(parseUnsubscribeToken(`${token}x`, secret)).toBeNull();
  });
});
