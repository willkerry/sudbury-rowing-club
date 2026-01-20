"use client";

import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import type { OfficerResponse } from "@sudburyrc/api";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { usePostHog } from "posthog-js/react";
import { shake } from "radashi";
import { z } from "zod";
import { kyInstance } from "@/app/get-query-client";
import { DisabledOverlay } from "@/components/contact/views/disabledOverlay";
import { Success } from "@/components/contact/views/success";
import Center from "@/components/stour/center";
import { Button } from "@/components/ui/button";
import { Error as ErrorComponent } from "@/components/ui/error";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TextArea } from "@/components/ui/textarea";
import { useTrackFormStarted } from "@/hooks/useTrackFormStarted";
import { scrollToSelector } from "@/lib/scrollToSelector";
import { cn } from "@/lib/utils";
import { FromAndTo } from "./fromAndTo";
import { useTestingMode } from "./useTestingMode";

const MessageToSchema = z.string().refine((value) => value !== "default", {
  message: "Select a recipient",
});
const MessageNameSchema = z.string().min(1, "Provide your name");
const MessageEmailSchema = z.string().min(1, "Provide your email").email();
const MessageMessageSchema = z.string().trim().min(1, "Provide a message");

const MessageSchema = z.object({
  to: MessageToSchema,
  name: MessageNameSchema,
  email: MessageEmailSchema,
  message: MessageMessageSchema,
});

export type Message = z.infer<typeof MessageSchema>;

type Props = {
  disabled?: boolean;
  contacts: OfficerResponse[];
  initialValues: Partial<Message>;
};

/**
 * Renders the contact form. Intended for use on the contact page. So long as
 * valid recipients are provided, will render a fully-functional form.
 */
export const ContactForm = ({ disabled, contacts, initialValues }: Props) => {
  const recipientWasProvided = !!initialValues.to;

  const posthog = usePostHog();

  const { mutateAsync, status, error, data } = useMutation({
    mutationKey: ["contact-form"],
    mutationFn: (values: Message) =>
      kyInstance.post<string>("/api/send", { json: values }),
    onMutate: () => posthog.capture("contact_form_submitted"),
    onError: async (error) => {
      const isHttpError = error instanceof HTTPError;
      posthog.capture("contact_form_api_error", {
        error_message: error.message,
        error_name: error.name,
        http_status: isHttpError ? error.response.status : undefined,
        http_status_text: isHttpError ? error.response.statusText : undefined,
        response_body: isHttpError ? await error.response.text() : undefined,
      });
    },
    onSuccess: (data) =>
      posthog.capture("contact_form_success", { message_id: data.text() }),
  });

  const optionArray = contacts.map((contact) => ({
    value: contact._id,
    label: `${contact.role} (${contact.name})`,
  }));

  const form = useForm({
    defaultValues: {
      to: initialValues.to || "default",
      name: initialValues.name || "",
      email: initialValues.email || "",
      message: initialValues.message || "",
    },
    onSubmit: ({ value }) => mutateAsync(value),
    validators: { onSubmit: MessageSchema },
    onSubmitInvalid: ({ formApi }) => {
      const fieldErrors = Object.fromEntries(
        Object.entries(formApi.state.fieldMeta)
          .filter(([, meta]) => meta.errors.length > 0)
          .map(([field, meta]) => [field, meta.errors.map((e) => e.message)]),
      );

      posthog.capture("contact_form_validation_error", {
        fields_with_errors: Object.keys(fieldErrors),
        error_details: fieldErrors,
      });

      scrollToSelector('[aria-invalid="true"]');
    },
  });

  useTestingMode({
    setValues: (values) => {
      form.setFieldValue("to", values.to);
      form.setFieldValue("name", values.name);
      form.setFieldValue("email", values.email);
    },
  });

  const hasTouchedFields = Object.values(form.state.fieldMeta).some(
    (meta) => meta.isTouched,
  );

  useTrackFormStarted("contact_form", hasTouchedFields);

  if (disabled) return <DisabledOverlay form={<div />} />;
  if (data && status === "success") return <Success response={data} />;

  const disableFields =
    form.state.isSubmitting ||
    disabled ||
    form.state.isSubmitted ||
    status === "pending";

  return (
    <form
      className="grid grid-cols-2 gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="to">
        {(field) => (
          <Select
            className={cn("col-span-2", recipientWasProvided && "hidden")}
            disabled={disableFields}
            error={field.state.meta.errors[0]?.message}
            label="Who would you like to contact?"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          >
            <option value="default" disabled />
            {optionArray.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}
      </form.Field>

      <div className="-mb-4 col-span-2 grid gap-x-4 sm:grid-cols-2">
        <form.Field name="name">
          {(field) => (
            <Input
              disabled={disableFields}
              label="Your name"
              type="text"
              autoComplete="name"
              className="mb-4"
              error={field.state.meta.errors[0]?.message}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <Input
              disabled={disableFields}
              label="Your email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              className="mb-4"
              error={field.state.meta.errors[0]?.message}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      </div>

      <form.Subscribe
        selector={(state) => [
          state.values.to,
          state.values.name,
          state.values.email,
        ]}
      >
        {([to, name, email]) => (
          <FromAndTo
            to={shake(contacts.find((o) => o._id === to) ?? {})}
            isOpen={to !== "default"}
            from={{
              name,
              email: email || "Placeholder",
              isPlaceholder: !(name && form.getFieldValue("email")),
            }}
          />
        )}
      </form.Subscribe>

      <form.Field name="message">
        {(field) => (
          <TextArea
            label="Your message"
            className={cn("col-span-2")}
            disabled={disableFields}
            id={field.name}
            minRows={3}
            error={field.state.meta.errors[0]?.message}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      {status === "error" && (
        <ErrorComponent className="col-span-2" error={error}>
          <div className="text-sm">
            Contact us{" "}
            <Obfuscate email="webmaster@sudburyrowingclub.org.uk">
              by email
            </Obfuscate>
            .
          </div>
        </ErrorComponent>
      )}

      <Center className="col-span-2">
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              loading={isSubmitting}
              size="lg"
              type="submit"
              className="w-full"
              variant="secondary"
            >
              Send
            </Button>
          )}
        </form.Subscribe>
      </Center>
    </form>
  );
};
