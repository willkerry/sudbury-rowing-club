"use client";

/* eslint-disable jsx-a11y/label-has-associated-control */
import { Field, Form } from "react-final-form";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation } from "@tanstack/react-query";
import { FORM_ERROR } from "final-form";
import { getWodehouseFullDetails } from "get-wodehouse-name";
import { shake } from "radash";
import type { OfficerResponse } from "@sudburyrc/api";
import Input from "@/components/contact/fields/input";
import Select from "@/components/contact/fields/select";
import DisabledOverlay from "@/components/contact/views/disabledOverlay";
import Error from "@/components/contact/views/error";
import Success from "@/components/contact/views/success";
import Center from "@/components/stour/center";
import { Button } from "@/components/ui/button";
import { FromAndTo } from "./fromAndTo";

export type Message = {
  to: string;
  name: string;
  email: string;
  message: string;
};

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
    mutationFn: async (values: Record<string, any>) => {
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

  const form = (
    <Form
      initialValues={initialValues}
      onSubmit={(v) => mutateAsync(v)}
      render={({
        handleSubmit,
        submitting,
        pristine,
        submitSucceeded,
        submitFailed,
        submitError,
        hasValidationErrors,
        values,
      }) => {
        if (submitFailed)
          return <Error error={submitError} message={values.message} />;

        if (submitSucceeded) return <Success />;

        const disableSubmission =
          pristine ||
          submitting ||
          localDisabled ||
          submitSucceeded ||
          hasValidationErrors;
        const disableFields = submitting || localDisabled || submitSucceeded;

        const selectedContact = contacts.find((o) => o._id === values.to);

        return (
          <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <Field defaultValue="default" name="to">
              {({ input, meta }) => (
                <Select
                  disabled={disableFields}
                  id="to"
                  input={input}
                  label="Who would you like to contact?"
                  meta={meta}
                  options={optionArray}
                  pristine={pristine}
                  hidden={recipientWasProvided}
                />
              )}
            </Field>

            <div className="col-span-2 -mb-4 grid gap-x-4 sm:grid-cols-2">
              <Field name="name">
                {({ input, meta }) => (
                  <Input
                    disabled={disableFields}
                    id="name"
                    input={input}
                    label="Your name"
                    meta={meta}
                    placeholder={`${randomName.firstName} ${randomName.lastName}`}
                    type="text"
                    inputClassName="mb-4"
                  />
                )}
              </Field>

              <Field name="email">
                {({ input, meta }) => (
                  <Input
                    disabled={disableFields}
                    id="email"
                    input={input}
                    label="Your email"
                    meta={meta}
                    placeholder={randomName.email}
                    type="email"
                    inputClassName="mb-4"
                  />
                )}
              </Field>
            </div>

            <FromAndTo
              isOpen={values.to !== "default"}
              from={{
                name:
                  values.name ||
                  `${randomName.firstName} ${randomName.lastName}`,
                email: values.email || "Placeholder",
                isPlaceholder: !values.name || !values.email,
              }}
              to={shake(selectedContact)}
            />

            <Field name="message">
              {({ input, meta }) => (
                <div className="col-span-2">
                  <label htmlFor="message">Your message</label>
                  <TextareaAutosize
                    {...input}
                    className={meta.invalid && meta.touched ? "invalid" : ""}
                    disabled={disableFields}
                    id="message"
                    minRows={3}
                    required
                  />
                </div>
              )}
            </Field>

            <Center className="col-span-2">
              <Button
                id="message"
                disabled={disableSubmission}
                loading={submitting}
                size="lg"
                type="submit"
                className="w-full"
                variant="secondary"
              >
                Send
              </Button>
            </Center>
          </form>
        );
      }}
      validate={(values) => {
        const errors: any = {};
        if (values.to === "default") errors.to = "Required";
        if (!values.name) errors.name = "Required";
        if (!values.email) errors.email = "Required";
        if (!values.message) errors.message = "Required";
        return Object.keys(errors).length ? errors : undefined;
      }}
    />
  );
  if (localDisabled) return <DisabledOverlay form={form} />;
  return form;
};

export default ContactForm;
