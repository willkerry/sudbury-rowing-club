import { Heading, Section } from "@react-email/components";
import {
  ContactFormLink,
  EmailShell,
  FooterNote,
  GT,
  Label,
  LT,
  MessageBody,
  Quote,
  RightArrow,
  Value,
  WillLink,
} from "./_components";

interface ContactFormEmailProps {
  fromEmail?: string;
  fromName?: string;
  message?: string;
  toEmail?: string;
  toName?: string;
  toRole?: string;
}

export const ContactFormEmail = ({
  toName = "Per Person",
  toEmail = "per@person.com",
  toRole = "Chairperson",
  fromName = "From Person",
  fromEmail = "from@person.com",
  message = "Hello, this is a message\n\nIt has come to my attention that you are a person. This is a good thing, as I am also a person. We should meet up and do person things together.\n\nRegards,\n\nPerson",
}: ContactFormEmailProps) => (
  <EmailShell preview={message}>
    <Heading className="font-normal text-black text-lg">
      You have received a message via SRC Contact
    </Heading>

    <Section className="mb-4">
      <Label>From:</Label>
      <Value>
        {fromName} <LT />
        {fromEmail}
        <GT />
      </Value>
    </Section>

    <Section className="mb-4">
      <Label>To:</Label>
      <Value>
        <Quote value={toRole} /> <RightArrow /> {toName} <LT />
        {toEmail}
        <GT />
      </Value>
    </Section>

    <Section className="mb-4">
      <Label>Message:</Label>
      <MessageBody>{message}</MessageBody>
    </Section>

    <FooterNote>
      Sent using the <ContactFormLink /> on the Sudbury Rowing Club website. If
      you’re experiencing issues with this form, please <WillLink />.
    </FooterNote>
  </EmailShell>
);

export default ContactFormEmail;
