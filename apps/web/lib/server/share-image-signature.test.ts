import { describe, expect, it } from "vitest";
import {
  signShareImage,
  verifyShareImage,
} from "@/lib/server/share-image-signature";
import type { ShareImage } from "@/lib/share-image";

const SECRET = "test-secret-that-is-at-least-32-characters";
const IMAGE: ShareImage = {
  subtitle: "Regatta",
  title: "Results are in",
  variant: "dark",
};

describe("share image signatures", () => {
  it("verifies an image it signed", () => {
    expect(verifyShareImage(signShareImage(IMAGE, SECRET), SECRET)).toEqual(
      IMAGE,
    );
  });

  it("verifies regardless of parameter order", () => {
    const signed = signShareImage(IMAGE, SECRET);
    const reordered = new URLSearchParams([...signed].reverse());

    expect(verifyShareImage(reordered, SECRET)).toEqual(IMAGE);
  });

  it("rejects a changed title", () => {
    const params = signShareImage(IMAGE, SECRET);
    params.set("title", "Something else");

    expect(verifyShareImage(params, SECRET)).toBeUndefined();
  });

  it("rejects a different secret", () => {
    const params = signShareImage(IMAGE, SECRET);

    expect(
      verifyShareImage(params, "another-secret-of-at-least-32-chars"),
    ).toBeUndefined();
  });

  it("rejects a missing signature", () => {
    const params = signShareImage(IMAGE, SECRET);
    params.delete("sig");

    expect(verifyShareImage(params, SECRET)).toBeUndefined();
  });
});
