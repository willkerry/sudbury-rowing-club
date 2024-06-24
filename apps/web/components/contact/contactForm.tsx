"use client";

import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { getWodehouseFullDetails } from "get-wodehouse-name";
import { shake } from "radash";
import { z } from "zod";
import type { OfficerResponse } from "@sudburyrc/api";
import { cn } from "@/lib/utils";
import DisabledOverlay from "@/components/contact/views/disabledOverlay";
import Success from "@/components/contact/views/success";
import Center from "@/components/stour/center";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TextArea } from "@/components/ui/textarea";
import { Error as ErrorComponent } from "../ui/error";
import { FromAndTo } from "./fromAndTo";

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
  const localDisabled = disabled;
  const randomName = getWodehouseFullDetails();

  const recipientWasProvided = !!initialValues.to;

  const { mutateAsync, status, error } = useMutation({
    mutationFn: async (values: Message) => {
      const response = await fetch("/api/send", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const status = response?.status;
      if (status === 200) return undefined;

      throw new Error(await response?.text());

      // return { [FORM_ERROR]: `${status} ${await response?.text()}` };
    },
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
    validatorAdapter: zodValidator,
  });

  if (localDisabled) return <DisabledOverlay form={<div />} />;
  if (form.state.isSubmitted) return <Success />;

  const disableFields =
    form.state.isSubmitting ||
    localDisabled ||
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
      <form.Field name="to" validators={{ onSubmit: MessageToSchema }}>
        {(field) => (
          <Select
            className={cn("col-span-2", recipientWasProvided && "hidden")}
            disabled={disableFields}
            error={field.state.meta.touchedErrors[0]?.toString()}
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

      <div className="col-span-2 -mb-4 grid gap-x-4 sm:grid-cols-2">
        <form.Field name="name" validators={{ onSubmit: MessageNameSchema }}>
          {(field) => (
            <Input
              disabled={disableFields}
              label="Your name"
              placeholder={`${randomName.firstName} ${randomName.lastName}`}
              type="text"
              className="mb-4"
              error={field.state.meta.touchedErrors[0]?.toString()}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="email" validators={{ onSubmit: MessageEmailSchema }}>
          {(field) => {
            console.log(field.state.meta.touchedErrors);
            return (
              <Input
                disabled={disableFields}
                label="Your email"
                placeholder={randomName.email}
                type="email"
                className="mb-4"
                error={
                  field.state.meta.touchedErrors[0]?.toString().split(",")[0]
                }
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            );
          }}
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
              name: name || `${randomName.firstName} ${randomName.lastName}`,
              email: email || "Placeholder",
              isPlaceholder: !name || !form.getFieldValue("email"),
            }}
          />
        )}
      </form.Subscribe>

      <form.Field
        name="message"
        validators={{ onSubmit: MessageMessageSchema }}
      >
        {(field) => (
          <TextArea
            label="Your message"
            className={cn("col-span-2")}
            disabled={disableFields}
            id="message"
            minRows={3}
            required
            error={field.state.meta.touchedErrors[0]?.toString()}
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
