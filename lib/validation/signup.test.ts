import { describe, expect, it } from "vitest";
import { signupSchema } from "./signup";

const validInput = {
  name: "Amara Okafor",
  email: "  Amara@Example.COM ",
  countryCode: "GB",
  city: "London",
  instagram: "https://instagram.com/amara/",
  referralCode: "FRIEND123",
  heardAbout: "A friend shared the link",
  consent: true,
};

describe("signupSchema", () => {
  it("accepts a valid signup and returns normalized fields", () => {
    const result = signupSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.email).toBe("amara@example.com");
    expect(result.data.instagram).toBe("amara");
    expect(result.data.countryCode).toBe("GB");
  });

  it("rejects a country code outside the controlled list", () => {
    const result = signupSchema.safeParse({ ...validInput, countryCode: "ZZ" });
    expect(result.success).toBe(false);
  });

  it("rejects consent that is not exactly true", () => {
    expect(
      signupSchema.safeParse({ ...validInput, consent: false }).success,
    ).toBe(false);
    expect(
      signupSchema.safeParse({ ...validInput, consent: "true" }).success,
    ).toBe(false);
  });

  it("requires name and city", () => {
    expect(signupSchema.safeParse({ ...validInput, name: "" }).success).toBe(
      false,
    );
    expect(signupSchema.safeParse({ ...validInput, city: "" }).success).toBe(
      false,
    );
  });

  it("rejects oversized inputs", () => {
    expect(
      signupSchema.safeParse({ ...validInput, name: "a".repeat(81) }).success,
    ).toBe(false);
    expect(
      signupSchema.safeParse({ ...validInput, city: "a".repeat(81) }).success,
    ).toBe(false);
    expect(
      signupSchema.safeParse({ ...validInput, heardAbout: "a".repeat(201) })
        .success,
    ).toBe(false);
    expect(
      signupSchema.safeParse({
        ...validInput,
        email: `${"a".repeat(250)}@x.com`,
      }).success,
    ).toBe(false);
  });

  it("treats instagram, referralCode, and heardAbout as optional", () => {
    const result = signupSchema.safeParse({
      name: "Sam",
      email: "sam@example.com",
      countryCode: "US",
      city: "Austin",
      consent: true,
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.instagram).toBeUndefined();
    expect(result.data.referralCode).toBeUndefined();
  });

  it("rejects an instagram handle with illegal characters after normalization", () => {
    expect(
      signupSchema.safeParse({ ...validInput, instagram: "bad handle!" })
        .success,
    ).toBe(false);
    expect(
      signupSchema.safeParse({ ...validInput, instagram: "a".repeat(31) })
        .success,
    ).toBe(false);
  });

  it("normalizes a blank optional instagram to undefined", () => {
    const result = signupSchema.safeParse({
      ...validInput,
      instagram: "  @  ",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.instagram).toBeUndefined();
  });
});
