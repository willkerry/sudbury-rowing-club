"use client";

import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import type { OfficerResponse } from "@sudburyrc/api";
import { useForm } from "@tanstack/react-form";
import { TRPCClientError } from "@trpc/client";
import { usePostHog } from "posthog-js/react";
import { shake } from "radashi";
import { DisabledOverlay } from "@/components/contact/views/disabledOverlay";
import { Success } from "@/components/contact/views/success";
import Center from "@/components/stour/center";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TextArea } from "@/components/ui/textarea";
import { useTrackFormStarted } from "@/hooks/useTrackFormStarted";
import { getErrorMessage, withServerValidation } from "@/lib/form";
import { scrollToSelector } from "@/lib/scrollToSelector";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { FromAndTo } from "./fromAndTo";
import { DEFAULT_VALUE, type Message, MessageSchema } from "./Message";
import { useTestingMode } from "./useTestingMode";

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

  const { mutateAsync, status, error, data } = trpc.comms.send.useMutation({
    onError: (error) => {
      if (error instanceof TRPCClientError && error.data?.zodError) return;

      posthog.capture("contact_form_api_error", {
        error_message: error.message,
      });
    },
    onMutate: () => posthog.capture("contact_form_submitted"),
    onSuccess: (data) =>
      posthog.capture("contact_form_success", { message_id: data.messageId }),
  });

  const optionArray = contacts.map((contact) => ({
    label: `${contact.role} (${contact.name})`,
    value: contact._id,
  }));

  const form = useForm({
    defaultValues: {
      email: initialValues.email || "",
      message: initialValues.message || "",
      name: initialValues.name || "",
      to: initialValues.to || DEFAULT_VALUE,
    },
    onSubmitInvalid: ({ formApi }) => {
      const fieldErrors = Object.fromEntries(
        Object.entries(formApi.state.fieldMeta)
          .filter(([, meta]) => meta.errors.length > 0)
          .map(([field, meta]) => [field, meta.errors.map(getErrorMessage)]),
      );

      posthog.capture("contact_form_validation_error", {
        error_details: fieldErrors,
        fields_with_errors: Object.keys(fieldErrors),
      });

      scrollToSelector('[aria-invalid="true"]');
    },
    validators: {
      onSubmit: MessageSchema,
      onSubmitAsync: withServerValidation(mutateAsync),
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
  if (data && status === "success")
    return <Success messageId={data.messageId} />;

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
            error={getErrorMessage(field.state.meta.errors[0])}
            label="Who would you like to contact?"
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            value={field.state.value}
          >
            <option disabled value={DEFAULT_VALUE} />
            {optionArray.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}
      </form.Field>

      <div className="col-span-2 -mb-4 grid gap-x-4 sm:grid-cols-2">
        <form.Field name="name">
          {(field) => (
            <Input
              autoComplete="name"
              className="mb-4"
              disabled={disableFields}
              error={getErrorMessage(field.state.meta.errors[0])}
              label="Your name"
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              type="text"
              value={field.state.value}
            />
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <Input
              autoComplete="email"
              className="mb-4"
              disabled={disableFields}
              error={getErrorMessage(field.state.meta.errors[0])}
              label="Your email"
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              spellCheck={false}
              type="email"
              value={field.state.value}
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
            from={{
              name,
              email: email || "Placeholder",
              isPlaceholder: !(name && form.getFieldValue("email")),
            }}
            isOpen={to !== "default"}
            to={shake(contacts.find((o) => o._id === to) ?? {})}
          />
        )}
      </form.Subscribe>

      <form.Field name="message">
        {(field) => (
          <TextArea
            className={cn("col-span-2")}
            disabled={disableFields}
            error={getErrorMessage(field.state.meta.errors[0])}
            id={field.name}
            label="Your message"
            minRows={3}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            value={field.state.value}
          />
        )}
      </form.Field>

      {status === "error" &&
        !(error instanceof TRPCClientError && error.data?.zodError) && (
          <ErrorMessage className="col-span-2" error={error}>
            <div className="text-sm">
              Contact us{" "}
              <Obfuscate email="webmaster@sudburyrowingclub.org.uk">
                by email
              </Obfuscate>
              .
            </div>
          </ErrorMessage>
        )}

      <Center className="col-span-2">
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              className="w-full"
              loading={isSubmitting}
              size="lg"
              type="submit"
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
