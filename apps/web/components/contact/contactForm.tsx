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
import onSubmit from "./onSubmit";

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
 *
 * @param disabled Whether or not the form should be disabled. Defaults to
 * false. Disabled state is intended for exceptional use (i.e. when a
 * dependency, such as the mail server, is down).
 * @param contacts An array of contacts to populate the select field with. Their
 * `_id` must correspond to an officer ID in the database, or the form will
 * silently fail.
 * @param initialValues The initial values for the form. Defaults to an empty
 * object. Initial use pre-populates the form with a recipient using a URL query
 * parameter.
 */
const ContactForm = ({ disabled, contacts, initialValues }: Props) => {
  const localDisabled = disabled;
  const randomName = getWodehouseFullDetails();

  const optionArray = contacts.map((contact) => ({
    value: contact._id,
    label: `${contact.name} (${contact.role})`,
  }));

  const submitHandler = async (values: Message) => {
    const submissionErrors = await onSubmit(values);
    if (submissionErrors)
      return {
        [FORM_ERROR]: `${submissionErrors.status} ${submissionErrors.message}`,
      };

    return undefined;
  };

  const form = (
    <Form
      initialValues={initialValues}
      onSubmit={submitHandler}
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
