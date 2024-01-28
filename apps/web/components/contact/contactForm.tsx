/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form, Field } from "react-final-form";
import { FORM_ERROR } from "final-form";
import TextareaAutosize from "react-textarea-autosize";
import Input from "@/components/contact/fields/input";
import Select from "@/components/contact/fields/select";
import Error from "@/components/contact/views/error";
import Success from "@/components/contact/views/success";
import Button from "@/components/stour/button";
import Center from "@/components/stour/center";
import DisabledOverlay from "@/components/contact/views/disabledOverlay";
import type { OfficerResponse } from "@sudburyrc/api";
import { getWodehouseFullDetails } from "get-wodehouse-name";
import { useMutation } from "@tanstack/react-query";

export type Message = {
  to: string;
  name: string;
  email: string;
  message: string;
};

type Props = {
  disabled?: boolean;
  contacts: OfficerResponse[];
  initialValues: Message;
};

/**
 * Renders the contact form. Intended for use on the contact page. So long as
 * valid recipients are provided, will render a fully-functional form.
 */
const ContactForm = ({ disabled, contacts, initialValues }: Props) => {
  const localDisabled = disabled;
  const randomName = getWodehouseFullDetails();

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
    label: `${contact.name} (${contact.role})`,
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
                />
              )}
            </Field>

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
                />
              )}
            </Field>

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
                as="button"
                disabled={disableSubmission}
                isLoading={submitting}
                size="large"
                type="submit"
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
