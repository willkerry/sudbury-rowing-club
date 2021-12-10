import { Component } from "react";
import { sendContactMail } from "@/lib/mail-api";
import Button from "../stour/button";
import Link from "next/link";
import TextareaAutosize from "react-textarea-autosize";
import Loading from "../stour/loading";
import { CheckIcon } from "@heroicons/react/outline";
import Note from "../stour/note";

class ContactForm extends Component {
  state = {
    formButtonDisabled: false,
    formButtonText: "Send",
    name: "",
    mail: "",
    formContent: "",
    recipientMail: "default",
    errorHelpText: "",
  };

  render() {
    const {
      formButtonText,
      formButtonDisabled,
      name,
      mail,
      formContent,
      recipientMail,
      errorHelpText,
    } = this.state;

    const btnClass = formButtonDisabled ? "disabled" : "";

    const fieldClasses =
      "block w-full border-gray-200 rounded-md focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition";

    const enquiriesMail = "enquiries@sudburyrowingclub.org.uk";

    return (
      <form className="grid grid-cols-1 gap-6 mx-auto">
        <label htmlFor="recipient" className="block">
          <span className="text-gray-700">Recipient</span>
          <select
            name="recipient"
            className={fieldClasses}
            value={recipientMail}
            onChange={this.onRecipientChange}
          >
            <option value="default" disabled>
              Select a recipient
            </option>
            {this.props.contacts.map((officer) => (
              <option key={officer._id} value={officer._id}>
                {officer.role + ", " + officer.name}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="text" className="block">
          <span className="text-gray-700">Message</span>
          <TextareaAutosize
            name="text"
            placeholder="Message"
            value={formContent}
            onChange={this.onFormContentChange}
            className={fieldClasses}
          />
        </label>
        <div className="grid gap-6 md:grid-cols-2 md:gap-4">
          <label htmlFor="fname" className="block">
            <span className="text-gray-700">Your name</span>
            <input
              type="text"
              value={name}
              name="fname"
              onChange={this.onNameChange}
              placeholder="Josie Bloggs"
              className={fieldClasses}
            />
          </label>

          <label htmlFor="email" className="block">
            <span className="text-gray-700">Your email</span>
            <input
              type="email"
              value={mail}
              name="email"
              onChange={this.onMailChange}
              className={fieldClasses}
              placeholder="you@example.com"
            />
          </label>
        </div>
        <div className="mx-auto">
          <Button
            type="submit"
            onClick={this.submitContactForm}
            disabled={formButtonDisabled}
            as="button"
            size="large"
          >
            {formButtonText}
          </Button>
        </div>
        {errorHelpText && (
          <Note size="small" type="error" label="Error">
            We couldn’t process that request. If the problem persists, please
            mail us at{" "}
            <Link
              href={
                "mailto:" + enquiriesMail + "?body=" + encodeURI(formContent)
              }
            >
              {enquiriesMail}
            </Link>{" "}
            instead. (This link will open a new email on your device and
            autofill the message above.)
          </Note>
        )}
      </form>
    );
  }

  onNameChange = (event) => {
    this.setState({ name: event.target.value });
  };

  onMailChange = (event) => {
    this.setState({ mail: event.target.value });
  };

  onRecipientChange = (event) => {
    this.setState({ recipientMail: event.target.value });
  };

  onFormContentChange = (event) => {
    this.setState({ formContent: event.target.value });
  };

  submitContactForm = async (event) => {
    event.preventDefault();
    this.setState({ formButtonText: Loading() });

    const { name, mail, formContent, recipientMail } = this.state;

    const res = await sendContactMail(recipientMail, name, mail, formContent);
    if (res.status < 300) {
      this.setState({
        formButtonDisabled: true,
        formButtonText: (
          <>
            <CheckIcon className="w-6 h-6 mr-1" /> Sent
          </>
        ),
        name: "",
        mail: "",
        formContent: "",
      });
    } else {
      this.setState({
        formButtonText: "Could not be sent.",
        errorHelpText: true,
      });
    }
  };
}

export default ContactForm;
