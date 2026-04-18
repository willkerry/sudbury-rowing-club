import { Heading, Link, Section, Text } from "@react-email/components";
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

interface ContactFormFailedEmailProps {
  fallbackEmail?: string;
  fromName?: string;
  message?: string;
  toName?: string;
  toRole?: string;
}

export const ContactFormFailedEmail = ({
  fallbackEmail = "enquiries@sudburyrowingclub.org.uk",
  fromName = "From Person",
  toName = "Per Person",
  toRole = "Chairperson",
  message = "Hello, this is a message\n\nIt has come to my attention that you are a person. This is a good thing, as I am also a person. We should meet up and do person things together.\n\nRegards,\n\nPerson",
}: ContactFormFailedEmailProps) => (
  <EmailShell preview="Don’t expect a reply. Here’s what to do next.">
    <Heading className="font-normal text-black text-lg">
      We couldn’t deliver your message, {fromName}
    </Heading>

    <Section className="mb-2">
      <Text className="text-gray-700 text-sm">
        Your message didn’t get through, so don’t expect a reply.
      </Text>

      <Text className="text-gray-700 text-sm">
        Please email{" "}
        <Link className="text-blue-500" href={`mailto:${fallbackEmail}`}>
          {fallbackEmail}
        </Link>{" "}
        directly. Someone at the club will read it and pass it on.
      </Text>
    </Section>

    <Section className="mb-4">
      <Label>Couldn’t reach:</Label>
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

export default ContactFormFailedEmail;
