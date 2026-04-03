import "server-only";

import type { TurnstileServerValidationResponse } from "@marsidev/react-turnstile";
import ky from "ky";
import { env } from "@/env";

const VERIFY_ENDPOINT =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const verifyTurnstileToken = async (token: string, ip: string) =>
  ky
    .post<TurnstileServerValidationResponse>(VERIFY_ENDPOINT, {
      headers: {
        "Content-Type": "application/json",
      },
      json: {
        remoteip: ip,
        response: token,
        secret: env.TURNSTILE_SECRET_KEY,
      },
    })
    .json();

export const checkHeadersForTurnstileToken = async (
  headers: Headers,
  { token }: { token: string },
) => verifyTurnstileToken(token, headers.get("x-forwarded-for") ?? "");
