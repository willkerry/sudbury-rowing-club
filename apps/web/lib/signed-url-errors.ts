export const SignedUrlErrorCode = {
  INVALID_SIGNATURE: "INVALID_SIGNATURE",
  INVALID_URL_FORMAT: "INVALID_URL_FORMAT",
  MISSING_PARAMETERS: "MISSING_PARAMETERS",
  UNSUPPORTED_PROTOCOL: "UNSUPPORTED_PROTOCOL",
} as const;

export type SignedUrlErrorCode =
  (typeof SignedUrlErrorCode)[keyof typeof SignedUrlErrorCode];

const ERROR_MESSAGES: Record<SignedUrlErrorCode, string> = {
  [SignedUrlErrorCode.MISSING_PARAMETERS]:
    "The link is incomplete or missing required information.",
  [SignedUrlErrorCode.INVALID_SIGNATURE]:
    "This link has not been verified. It may have been modified or tampered with.",
  [SignedUrlErrorCode.INVALID_URL_FORMAT]:
    "The destination is not a valid web address.",
  [SignedUrlErrorCode.UNSUPPORTED_PROTOCOL]:
    "This link uses an unsupported protocol. Only HTTP and HTTPS links are allowed.",
};

export class SignedUrlError extends Error {
  readonly code: SignedUrlErrorCode;
  readonly userMessage: string;

  constructor(code: SignedUrlErrorCode, technicalMessage?: string) {
    super(technicalMessage || ERROR_MESSAGES[code]);
    this.name = "SignedUrlError";
    this.code = code;
    this.userMessage = ERROR_MESSAGES[code];
    Object.setPrototypeOf(this, SignedUrlError.prototype);
  }
}

export const isSignedUrlError = (error: unknown): error is SignedUrlError =>
  error instanceof SignedUrlError;
