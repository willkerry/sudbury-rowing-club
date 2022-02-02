/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from "prop-types";
import { Form, Field } from "react-final-form";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import getRandomName from "@/lib/random-name";
// import { AlertCircle, CheckCircle, SendIcon } from "react-feather";
import Button from "../stour/button";
import Center from "../stour/center";

const onSubmit = async (values) => {
  console.log("Attempting to send message...", { ...values });
  await axios
    .post("/api/send", values)
    .then((response) => {
      console.error(response);
      // res = response.data;
    })
    .catch((error) => {
      console.error(error);
      // res = error.response.data;
    });
  // resetForm();
  // setSubmitting(false);
  // setSent(true);
};

export default function ContactForm({ contacts, initialValues }) {
  const randomName = getRandomName();
  // let res = "";
  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      render={({
        handleSubmit,
        submitting,
        pristine,
        // values, form
      }) => (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/*
           * Recipient select
           */}
          <div className="col-span-2">
            <label htmlFor="to">Who would you like to contact?</label>
            <Field
              component="select"
              name="to"
              id="to"
              defaultValue="default"
              required
            >
              <option disabled value="default">
                Select an officer
              </option>
              {contacts.map((contact) => (
                <option key={contact._id} value={contact._id}>
                  {contact.role} ({contact.name})
                </option>
              ))}
            </Field>
          </div>
          {/*
           * From name
           */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="from-name">Your name</label>
            <Field
              id="from-name"
              name="from_name"
              type="text"
              component="input"
              placeholder={randomName[0]}
              required
            />
          </div>
          {/*
           * From email
           */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="from-email">Your email address</label>
            <Field
              name="from_mail"
              id="from-mail"
              type="email"
              component="input"
              placeholder={randomName[1]}
              required
            />
          </div>
          {/*
           * Message
           */}
          <div className="col-span-2">
            <label htmlFor="message">Your message</label>
            <Field name="message" minRows={3}>
              {(props) => (
                <div>
                  <TextareaAutosize
                    id="message"
                    minRows={3}
                    required
                    // eslint-disable-next-line react/prop-types
                    name={props.input.name}
                    // eslint-disable-next-line react/prop-types
                    value={props.input.value}
                    // eslint-disable-next-line react/prop-types
                    onChange={props.input.onChange}
                  />
                </div>
              )}
            </Field>
          </div>

          <Center className="col-span-2">
            <Button
              as="button"
              id="message"
              type="submit"
              size="large"
              disabled={submitting || pristine}
              // iconRight={<SendIcon />}
              // isLoading={isSubmitting}
            >
              Send
            </Button>
          </Center>
        </form>
      )}
    />
  );
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
    from_name: PropTypes.string,
    from_mail: PropTypes.string,
    message: PropTypes.string,
  }),
};

ContactForm.defaultProps = {
  initialValues: {
    to: "",
    from_name: "",
    from_mail: "",
    message: "",
  },
};