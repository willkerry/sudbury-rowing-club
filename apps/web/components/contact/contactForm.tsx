"use client";

import { kyInstance } from "@/app/get-query-client";
import { DisabledOverlay } from "@/components/contact/views/disabledOverlay";
import { Success } from "@/components/contact/views/success";
import Center from "@/components/stour/center";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TextArea } from "@/components/ui/textarea";
import { scrollToSelector } from "@/lib/scrollToSelector";
import { cn } from "@/lib/utils";
import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import type { OfficerResponse } from "@sudburyrc/api";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { shake } from "radash";
import { z } from "zod";
import { Error as ErrorComponent } from "../ui/error";
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
const ContactForm = ({ disabled, contacts, initialValues }: Props) => {
  const recipientWasProvided = !!initialValues.to;

  const { mutateAsync, status, error } = useMutation({
    mutationKey: ["contact-form"],
    mutationFn: (values: Message) =>
      kyInstance.post("/api/send", { json: values }),
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
    onSubmitInvalid: () => scrollToSelector('[aria-invalid="true"]'),
  });

  useTestingMode({
    setValues: (values) => {
      form.setFieldValue("to", values.to);
      form.setFieldValue("name", values.name);
      form.setFieldValue("email", values.email);
    },
  });

  if (disabled) return <DisabledOverlay form={<div />} />;
  if (form.state.isSubmitted) return <Success />;

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
            error={field.state.meta.errors[0]?.toString()}
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
              className="mb-4"
              error={field.state.meta.errors[0]?.toString()}
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
              className="mb-4"
              error={field.state.meta.errors[0]?.toString().split(",")[0]}
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
            to={shake(contacts.find((o) => o._id === to))}
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
            id="message"
            minRows={3}
            error={field.state.meta.errors[0]?.toString()}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      {status === "error" && (
        <ErrorComponent className="col-span-2" error={error}>
          Contact us{" "}
          <Obfuscate email="webmaster@sudburyrowingclub.org.uk">
            by email
          </Obfuscate>
          .
        </ErrorComponent>
      )}

      <Center className="col-span-2">
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              id="message"
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

export default ContactForm;
