import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockVerify, mockSend, mockKvGet, mockKvSet, mockKvDel, mockTrack } =
  vi.hoisted(() => ({
    mockKvDel: vi.fn(),
    mockKvGet: vi.fn(),
    mockKvSet: vi.fn(),
    mockSend: vi.fn(),
    mockTrack: vi.fn(),
    mockVerify: vi.fn(),
  }));

vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = { send: mockSend };
    webhooks = { verify: mockVerify };
  },
}));

vi.mock("@vercel/kv", () => ({
  kv: { del: mockKvDel, get: mockKvGet, set: mockKvSet },
}));

vi.mock("@/env", () => ({
  env: {
    RESEND_API_KEY: "test-key",
    RESEND_WEBHOOK_SECRET: "test-secret",
  },
}));

vi.mock("@/lib/server/track", () => ({
  trackServerEvent: mockTrack,
}));

vi.mock("emails/contact-form-delivered", () => ({
  ContactFormDeliveredEmail: (props: Record<string, unknown>) => ({
    __props: props,
    __template: "delivered",
  }),
}));

vi.mock("emails/contact-form-failed", () => ({
  ContactFormFailedEmail: (props: Record<string, unknown>) => ({
    __props: props,
    __template: "failed",
  }),
}));

const { POST } = await import("./route");

const EMAIL_ID = "abc-123";
const SAMPLE_CONTACT = {
  fromEmail: "alice@example.com",
  fromName: "Alice Example",
  message: "Please sign me up for trial sessions.",
  toName: "Bob Officer",
  toRole: "Captain",
};
const OFFICER_EMAIL = "officer-private@example.com";

const DEFAULT_HEADERS = {
  "svix-id": "msg_1",
  "svix-signature": "v1,sig",
  "svix-timestamp": "1",
};

const buildRequest = (
  body: unknown = {},
  headers: Record<string, string> = DEFAULT_HEADERS,
) =>
  ({
    headers: { get: (key: string) => headers[key] ?? null },
    text: async () => JSON.stringify(body),
  }) as unknown as NextRequest;

const FAILURE_SUBJECT_PATTERN = /couldn.t deliver/i;

beforeEach(() => {
  vi.clearAllMocks();
  mockSend.mockResolvedValue({ data: { id: "sent-id" }, error: null });
  mockKvGet.mockResolvedValue(SAMPLE_CONTACT);
  mockKvDel.mockResolvedValue(1);
});

describe("POST /api/webhooks/resend", () => {
  describe("terminal success event", () => {
    it("sends the delivered notification and clears the inflight entry", async () => {
      mockVerify.mockReturnValue({
        data: { email_id: EMAIL_ID, tags: { source: "contact_form" } },
        type: "email.delivered",
      });

      const response = await POST(buildRequest());

      expect(response.status).toBe(200);
      expect(mockSend).toHaveBeenCalledTimes(1);

      const args = mockSend.mock.calls[0][0];

      expect(args.to).toContain(SAMPLE_CONTACT.fromEmail);
      expect(args.subject).toContain("delivered");
      expect(args.subject).toContain(SAMPLE_CONTACT.toName);
      expect(args.react.__template).toBe("delivered");
      expect(args.react.__props.message).toBe(SAMPLE_CONTACT.message);
      expect(args.react.__props.fromName).toBe(SAMPLE_CONTACT.fromName);
      expect(args.react.__props.toName).toBe(SAMPLE_CONTACT.toName);
      expect(args.react.__props.toRole).toBe(SAMPLE_CONTACT.toRole);
      expect(mockKvDel).toHaveBeenCalledWith(`contact:inflight:${EMAIL_ID}`);
    });
  });

  describe("terminal failure events", () => {
    it.each([
      "email.bounced",
      "email.complained",
      "email.failed",
    ])("sends the failed notification and clears the inflight entry for %s", async (type) => {
      mockVerify.mockReturnValue({
        data: { email_id: EMAIL_ID, tags: { source: "contact_form" } },
        type,
      });

      const response = await POST(buildRequest());

      expect(response.status).toBe(200);
      expect(mockSend).toHaveBeenCalledTimes(1);

      const args = mockSend.mock.calls[0][0];

      expect(args.to).toContain(SAMPLE_CONTACT.fromEmail);
      expect(args.subject).toMatch(FAILURE_SUBJECT_PATTERN);
      expect(args.subject).toContain(SAMPLE_CONTACT.toName);
      expect(args.text).toContain("enquiries@sudburyrowingclub.org.uk");
      expect(args.react.__template).toBe("failed");
      expect(args.react.__props.message).toBe(SAMPLE_CONTACT.message);
      expect(args.react.__props.fromName).toBe(SAMPLE_CONTACT.fromName);
      expect(args.react.__props.toRole).toBe(SAMPLE_CONTACT.toRole);
      expect(args.react.__props.fallbackEmail).toBe(
        "enquiries@sudburyrowingclub.org.uk",
      );
      expect(mockKvDel).toHaveBeenCalledWith(`contact:inflight:${EMAIL_ID}`);
    });
  });

  describe("non-terminal events", () => {
    it.each([
      "email.sent",
      "email.opened",
      "email.clicked",
      "email.delivery_delayed",
      "email.scheduled",
    ])("ignores %s without sending or deleting", async (type) => {
      mockVerify.mockReturnValue({
        data: { email_id: EMAIL_ID, tags: { source: "contact_form" } },
        type,
      });

      const response = await POST(buildRequest());

      expect(response.status).toBe(200);
      expect(mockSend).not.toHaveBeenCalled();
      expect(mockKvDel).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("ignores events for an unknown email_id", async () => {
      mockVerify.mockReturnValue({
        data: { email_id: "not-tracked", tags: { source: "contact_form" } },
        type: "email.delivered",
      });
      mockKvGet.mockResolvedValue(null);

      const response = await POST(buildRequest());

      expect(response.status).toBe(200);
      expect(mockSend).not.toHaveBeenCalled();
      expect(mockKvDel).not.toHaveBeenCalled();
    });

    it("returns 400 when Svix headers are missing", async () => {
      const response = await POST(buildRequest({}, {}));

      expect(response.status).toBe(400);
      expect(mockVerify).not.toHaveBeenCalled();
    });

    it("returns 400 when signature verification throws", async () => {
      mockVerify.mockImplementation(() => {
        throw new Error("invalid signature");
      });

      const response = await POST(buildRequest());

      expect(response.status).toBe(400);
      expect(mockSend).not.toHaveBeenCalled();
      expect(mockKvDel).not.toHaveBeenCalled();
    });

    it("ignores verified payloads whose email_id is missing", async () => {
      mockVerify.mockReturnValue({ data: {}, type: "email.delivered" });

      const response = await POST(buildRequest());

      expect(response.status).toBe(200);
      expect(mockSend).not.toHaveBeenCalled();
      expect(mockKvDel).not.toHaveBeenCalled();
    });

    it("rejects KV payloads that fail schema validation", async () => {
      mockVerify.mockReturnValue({
        data: { email_id: EMAIL_ID, tags: { source: "contact_form" } },
        type: "email.delivered",
      });
      mockKvGet.mockResolvedValue({ fromEmail: "not-an-email" });

      const response = await POST(buildRequest());

      expect(response.status).toBe(200);
      expect(mockSend).not.toHaveBeenCalled();
      expect(mockKvDel).not.toHaveBeenCalled();
    });

    it("re-inserts the inflight entry when the follow-up send fails", async () => {
      mockVerify.mockReturnValue({
        data: { email_id: EMAIL_ID, tags: { source: "contact_form" } },
        type: "email.delivered",
      });
      mockSend.mockResolvedValue({
        data: null,
        error: { message: "boom", name: "ApiError" },
      });

      const response = await POST(buildRequest());

      expect(response.status).toBe(500);
      expect(mockKvDel).toHaveBeenCalledWith(`contact:inflight:${EMAIL_ID}`);
      expect(mockKvSet).toHaveBeenCalledWith(
        `contact:inflight:${EMAIL_ID}`,
        SAMPLE_CONTACT,
        expect.objectContaining({ ex: expect.any(Number) }),
      );
      expect(mockTrack).toHaveBeenCalledWith(
        "contact_form_status_notification_failure",
        expect.objectContaining({ event_type: "email.delivered" }),
      );
    });

    it("ignores webhook events that aren't tagged as contact-form sends", async () => {
      mockVerify.mockReturnValue({
        data: { email_id: EMAIL_ID },
        type: "email.delivered",
      });

      const response = await POST(buildRequest());

      expect(response.status).toBe(200);
      expect(mockKvGet).not.toHaveBeenCalled();
      expect(mockKvDel).not.toHaveBeenCalled();
      expect(mockSend).not.toHaveBeenCalled();
    });

    it("ignores webhook events tagged with a different source", async () => {
      mockVerify.mockReturnValue({
        data: { email_id: EMAIL_ID, tags: { source: "bug_report" } },
        type: "email.delivered",
      });

      const response = await POST(buildRequest());

      expect(response.status).toBe(200);
      expect(mockKvGet).not.toHaveBeenCalled();
      expect(mockKvDel).not.toHaveBeenCalled();
      expect(mockSend).not.toHaveBeenCalled();
    });

    it("skips the send when another handler has already claimed the event", async () => {
      mockVerify.mockReturnValue({
        data: { email_id: EMAIL_ID, tags: { source: "contact_form" } },
        type: "email.delivered",
      });
      mockKvDel.mockResolvedValue(0);

      const response = await POST(buildRequest());

      expect(response.status).toBe(200);
      expect(mockSend).not.toHaveBeenCalled();
      expect(mockKvSet).not.toHaveBeenCalled();
    });
  });

  describe("privacy", () => {
    it("does not expose any officer email address in the outgoing notifications", async () => {
      mockVerify.mockReturnValue({
        data: { email_id: EMAIL_ID, tags: { source: "contact_form" } },
        type: "email.bounced",
      });
      mockKvGet.mockResolvedValue({
        ...SAMPLE_CONTACT,
        toEmail: OFFICER_EMAIL,
      });

      const response = await POST(buildRequest());

      expect(response.status).toBe(200);

      const serialized = JSON.stringify(mockSend.mock.calls[0][0]);

      expect(serialized).not.toContain(OFFICER_EMAIL);
    });
  });
});
