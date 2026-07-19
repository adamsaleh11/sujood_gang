import { describe, expect, it } from "vitest";
import { normalizeEmail, normalizeInstagram } from "./normalize";

describe("normalizeEmail", () => {
  it("lowercases and trims surrounding whitespace", () => {
    expect(normalizeEmail("  Person@Example.COM  ")).toBe("person@example.com");
  });

  it("leaves an already-normalized address unchanged", () => {
    expect(normalizeEmail("person@example.com")).toBe("person@example.com");
  });
});

describe("normalizeInstagram", () => {
  it("reduces @handle, profile URLs, and a bare handle to the same value", () => {
    expect(normalizeInstagram("@handle")).toBe("handle");
    expect(normalizeInstagram("https://instagram.com/handle/")).toBe("handle");
    expect(normalizeInstagram("handle")).toBe("handle");
  });

  it("strips www, http, and www.instagram.com host variants", () => {
    expect(normalizeInstagram("http://www.instagram.com/handle")).toBe(
      "handle",
    );
    expect(normalizeInstagram("instagram.com/handle")).toBe("handle");
  });

  it("trims whitespace and lowercases", () => {
    expect(normalizeInstagram("  @Handle  ")).toBe("handle");
  });

  it("returns an empty string for empty or bare-symbol input", () => {
    expect(normalizeInstagram("   ")).toBe("");
    expect(normalizeInstagram("@")).toBe("");
  });
});
