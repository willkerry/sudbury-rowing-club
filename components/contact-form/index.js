import { Component } from "react";
import { sendContactMail } from "../../lib/mail-api";
import Button from "../stour/button";
import { contactableOfficers } from "../../lib/officer-contacts";

import data from "@/data/governance.json";

class ContactForm extends Component {
  state = {
    formButtonDisabled: false,
    formButtonText: "Send",
    name: "",
    mail: "",
    formContent: "",
    recipientMail: "",
  };

  render() {
    const {
      formButtonText,
      formButtonDisabled,
      name,
      mail,
      formContent,
      recipientMail,
    } = this.state;

    const btnClass = formButtonDisabled ? "disabled" : "";

    const fieldClasses =
      "block w-full mt-1 border-gray-200 rounded-md focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition";

    return (
      <form className="grid max-w-lg grid-cols-1 gap-6 mx-auto">
        <label htmlFor="fname" className="block">
          <span className="text-gray-700">Name</span>
          <input
            type="text"
            value={name}
            name="fname"
            onChange={this.onNameChange}
            className={fieldClasses}
          />
        </label>

        <label htmlFor="email" className="block">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            value={mail}
            name="email"
            onChange={this.onMailChange}
            className={fieldClasses}
          />
        </label>
        <label htmlFor="recipient" className="block">
          <span className="text-gray-700">Recipient</span>

          <select
            name="recipient"
            className={fieldClasses}
            value={recipientMail}
            onChange={this.onRecipientChange}
          >
            {contactableOfficers.map((officer, index) => (
              <option key={index} value={officer.hash}>
                {officer.role + ", " + officer.name}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="text" className="block">
          <span className="text-gray-700">Message</span>
          <textarea
            name="text"
            placeholder="Message"
            value={formContent}
            onChange={this.onFormContentChange}
            className={fieldClasses}
          />
        </label>
        <Button
          type="submit"
          onClick={this.submitContactForm}
          disabled={formButtonDisabled}
          label={formButtonText}
          button={true}
        />
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

    const { name, mail, formContent, recipientMail } = this.state;

    const res = await sendContactMail(recipientMail, name, mail, formContent);
    if (res.status < 300) {
      this.setState({
        formButtonDisabled: true,
        formButtonText: "Thanks for your message",
        name: "",
        mail: "",
        formContent: "",
      });
    }
    if (res.status > 300) {
      this.setState({
        formButtonText: "There‘s been an error. ",
      });
    } else {
      this.setState({ formButtonText: "I don’t kmnow what this error is." });
    }
  };
}

export default ContactForm;
