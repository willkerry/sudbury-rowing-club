/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-console */
import PropTypes from "prop-types";
import { Form, Field } from "react-final-form";
import { FORM_ERROR } from "final-form";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import getRandomName from "@/lib/random-name";
import Input from "@/components/contact/fields/input";
import Select from "@/components/contact/fields/select";
import Error from "@/components/contact/views/error";
import Success from "@/components/contact/views/success";
import Button from "@/components/stour/button";
import Center from "@/components/stour/center";
import DisabledOverlay from "@/components/contact/views/disabledOverlay";

const mailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

async function onSubmit(values) {
  await axios
    .post("/api/send", values)
    .then((res) => res)
    .catch((err) => {
      console.log(err.response);
      console.log(err.response.data.message);
      throw new Error(err.response.data.message);
    });
  return {
    success: true,
  };
}

export default function ContactForm({ contacts, initialValues, disabled }) {
  const localDisabled = disabled;
  const randomName = getRandomName();
  const optionArray = contacts.map((contact) => ({
    value: contact._id,
    label: `${contact.name} (${contact.role})`,
  }));
  const submitHandler = async (values) => {
    try {
      await onSubmit(values);
      return true;
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
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
        combinedDisabled = submitting || localDisabled || submitSucceeded,
      }) => (
        <>
          {submitFailed && (
            <Error error={submitError} message={values.message} />
          )}
          {submitSucceeded && <Success />}
          <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <Field defaultValue="default" name="to">
              {({ input, meta }) => (
                <Select
                  disabled={combinedDisabled}
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
                  disabled={combinedDisabled}
                  id="name"
                  input={input}
                  label="Your name"
                  meta={meta}
                  placeholder={randomName[0]}
                  type="text"
                />
              )}
            </Field>
            <Field name="email">
              {({ input, meta }) => (
                <Input
                  disabled={combinedDisabled}
                  id="email"
                  input={input}
                  label="Your email"
                  meta={meta}
                  placeholder={randomName[1]}
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
                    disabled={combinedDisabled}
                    id="message"
                    minRows={3}
                    required
                  />
                </div>
              )}
            </Field>
            <Center className="col-span-2">
              <Button
                as="button"
                disabled={pristine || combinedDisabled || hasValidationErrors}
                id="message"
                isLoading={submitting}
                size="large"
                type="submit"
              >
                Send
              </Button>
            </Center>
          </form>
        </>
      )}
      validate={(values) => {
        const errors = {};
        if (values.to === "default") errors.to = "Required";
        if (!values.name) errors.name = "Required";
        if (!values.email) errors.email = "Required";
        if (!mailRegex.test(values.email))
          errors.email = "Invalid email address";
        if (!values.message) errors.message = "Required";
        return Object.keys(errors).length ? errors : undefined;
      }}
    />
  );
  if (localDisabled) return <DisabledOverlay form={form} />;
  return form;
}

ContactForm.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    })
  ).isRequired,
  initialValues: PropTypes.shape({
    to: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    message: PropTypes.string,
  }),
  disabled: PropTypes.bool,
};

ContactForm.defaultProps = {
  initialValues: {
    to: "",
    name: "",
    email: "",
    message: "",
  },
  disabled: false,
};
