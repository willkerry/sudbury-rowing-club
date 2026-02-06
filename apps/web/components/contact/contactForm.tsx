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
import { Error as ErrorComponent } from "@/components/ui/error";
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
    onMutate: () => posthog.capture("contact_form_submitted"),
    onError: (error) => {
      if (error instanceof TRPCClientError && error.data?.zodError) return;

      posthog.capture("contact_form_api_error", {
        error_message: error.message,
        error_name: error.name,
      });
    },
    onSuccess: (data) =>
      posthog.capture("contact_form_success", { message_id: data.messageId }),
  });

  const optionArray = contacts.map((contact) => ({
    value: contact._id,
    label: `${contact.role} (${contact.name})`,
  }));

  const form = useForm({
    defaultValues: {
      to: initialValues.to || DEFAULT_VALUE,
      name: initialValues.name || "",
      email: initialValues.email || "",
      message: initialValues.message || "",
    },
    validators: {
      onSubmit: MessageSchema,
      onSubmitAsync: withServerValidation(mutateAsync),
    },
    onSubmitInvalid: ({ formApi }) => {
      const fieldErrors = Object.fromEntries(
        Object.entries(formApi.state.fieldMeta)
          .filter(([, meta]) => meta.errors.length > 0)
          .map(([field, meta]) => [field, meta.errors.map(getErrorMessage)]),
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
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          >
            <option value={DEFAULT_VALUE} disabled />
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
              error={getErrorMessage(field.state.meta.errors[0])}
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
              error={getErrorMessage(field.state.meta.errors[0])}
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
            error={getErrorMessage(field.state.meta.errors[0])}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      {status === "error" &&
        !(error instanceof TRPCClientError && error.data?.zodError) && (
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
