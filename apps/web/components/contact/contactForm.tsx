"use client";

import { FieldApi, useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { FORM_ERROR } from "final-form";
import { getWodehouseFullDetails } from "get-wodehouse-name";
import { shake } from "radash";
import { z } from "zod";
import type { OfficerResponse } from "@sudburyrc/api";
import { cn } from "@/lib/utils";
import DisabledOverlay from "@/components/contact/views/disabledOverlay";
import Error from "@/components/contact/views/error";
import Success from "@/components/contact/views/success";
import Center from "@/components/stour/center";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TextArea } from "@/components/ui/textarea";
import { FromAndTo } from "./fromAndTo";

const MessageSchema = z.object({
  to: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  message: z.string().trim().min(1, "Message must be at least 1 character"),
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

  const { mutateAsync } = useMutation({
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

      return { [FORM_ERROR]: `${status} ${await response?.text()}` };
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
    validators: { onChange: MessageSchema },
  });

  if (localDisabled) return <DisabledOverlay form={<div />} />;
  if (form.state.isSubmitted) return <Success />;
  // if ("submit failed") return <Error error={submitError} message={values.message} />

  const disableSubmission =
    form.state.isPristine ||
    form.state.isSubmitting ||
    localDisabled ||
    form.state.isSubmitted ||
    !form.state.isFormValid;

  const isFieldDisabled = (field: FieldApi<any, any>) =>
    form.state.isSubmitting || localDisabled || form.state.isSubmitted;

  const disableFields =
    form.state.isSubmitting || localDisabled || form.state.isSubmitted;

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
          <form.Subscribe selector={(state) => state.errors}>
            {(errors) => (
              <Select
                className="col-span-2"
                disabled={disableFields}
                error={errors?.join(", ")}
                hidden={recipientWasProvided}
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
          </form.Subscribe>
        )}
      </form.Field>

      <div className="col-span-2 -mb-4 grid gap-x-4 sm:grid-cols-2">
        <form.Field name="name">
          {(field) => (
            <form.Subscribe selector={(state) => state.errors}>
              {(errors) => (
                <Input
                  disabled={disableFields}
                  label="Your name"
                  placeholder={`${randomName.firstName} ${randomName.lastName}`}
                  type="text"
                  className="mb-4"
                  error={errors?.join(", ")}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </form.Subscribe>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <form.Subscribe selector={(state) => state.errors}>
              {(errors) => (
                <Input
                  disabled={disableFields}
                  label="Your email"
                  placeholder={randomName.email}
                  type="email"
                  className="mb-4"
                  error={errors?.join(", ")}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </form.Subscribe>
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
              name: name || `${randomName.firstName} ${randomName.lastName}`,
              email: email || "Placeholder",
              isPlaceholder: !name || !form.getFieldValue("email"),
            }}
          />
        )}
      </form.Subscribe>

      <form.Field name="message">
        {(field) => (
          <form.Subscribe selector={(state) => state.errors}>
            {(errors) => (
              <TextArea
                label="Your message"
                className={cn("col-span-2")}
                disabled={disableFields}
                id="message"
                minRows={3}
                required
                error={errors?.join(", ")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Subscribe>
        )}
      </form.Field>

      <Center className="col-span-2">
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              id="message"
              // disabled={disableSubmission}
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

// validate={(values) => {
//   const errors: any = {};
//   if (values.to === "default") errors.to = "Required";
//   if (!values.name) errors.name = "Required";
//   if (!values.email) errors.email = "Required";
//   if (!values.message) errors.message = "Required";
//   return Object.keys(errors).length ? errors : undefined;
// }}
export default ContactForm;
