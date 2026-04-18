import { Heading, Section, Text } from "@react-email/components";
import {
  ContactFormLink,
  EmailShell,
  FooterNote,
  Label,
  MessageBody,
  Quote,
  RightArrow,
  Value,
  WillLink,
} from "./_components";

interface ContactFormDeliveredEmailProps {
  fromName?: string;
  message?: string;
  toName?: string;
  toRole?: string;
}

export const ContactFormDeliveredEmail = ({
  toName = "Per Person",
  toRole = "Chairperson",
  fromName = "From Person",
  message = "Hello, this is a message\n\nIt has come to my attention that you are a person. This is a good thing, as I am also a person. We should meet up and do person things together.\n\nRegards,\n\nPerson",
}: ContactFormDeliveredEmailProps) => (
  <EmailShell preview={`${toName} will reply to you directly.`}>
    <Heading className="font-normal text-black text-lg">
      We’ve delivered your message, {fromName}
    </Heading>

    <Text className="text-gray-700 text-sm">
      {toName} will reply to you directly.
    </Text>

    <Section className="mb-4">
      <Label>Delivered to:</Label>
      <Value>
        <Quote value={toRole} /> <RightArrow /> {toName}
      </Value>
    </Section>

    <Section className="mb-4">
      <Label>Your message:</Label>
      <MessageBody>{message}</MessageBody>
    </Section>

    <FooterNote>
      You’re receiving this because you sent a message using the{" "}
      <ContactFormLink /> on the Sudbury Rowing Club website. If you didn’t send
      this, please <WillLink />.
    </FooterNote>
  </EmailShell>
);

export default ContactFormDeliveredEmail;
