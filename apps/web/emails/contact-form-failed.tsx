import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Markdown,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ContactFormFailedEmailProps {
  fallbackEmail?: string;
  fromName?: string;
  message?: string;
  toRole?: string;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="my-2 block font-medium text-gray-500 text-sm">
    {children}
  </span>
);

export const ContactFormFailedEmail = ({
  fallbackEmail = "enquiries@sudburyrowingclub.org.uk",
  fromName = "From Person",
  toRole = "Chairperson",
  message = "Hello, this is a message\n\nIt has come to my attention that you are a person. This is a good thing, as I am also a person. We should meet up and do person things together.\n\nRegards,\n\nPerson",
}: ContactFormFailedEmailProps) => (
  <Html>
    <Head />

    <Preview>Don’t expect a reply. Here’s what to do next.</Preview>

    <Tailwind>
      <Body className="font-sans">
        <Container>
          <Heading className="font-normal text-black text-lg">
            We couldn’t deliver your message, {fromName}
          </Heading>

          <Text className="text-gray-700 text-sm">
            Your message to the <em>{toRole}</em> didn’t reach them, so don’t
            expect a reply.
          </Text>

          <Text className="text-gray-700 text-sm">
            Please email{" "}
            <Link className="text-blue-500" href={`mailto:${fallbackEmail}`}>
              {fallbackEmail}
            </Link>{" "}
            directly. Someone at the club will read it and pass it on.
          </Text>

          <Section>
            <Row>
              <Column>
                <Label>Your message:</Label>
                <div className="m-0 text-gray-900 text-sm">
                  <Markdown>{message}</Markdown>
                </div>
              </Column>
            </Row>
          </Section>

          <Section className="mt-8">
            <Hr className="border-gray-200" />
            <Text className="font-medium text-gray-600 text-xs">
              You’re receiving this because you sent a message using the{" "}
              <Link
                className="text-blue-500"
                href="https://sudburyrowingclub.org.uk/contact"
              >
                contact form
              </Link>{" "}
              on the Sudbury Rowing Club website. If you didn’t send this,
              please{" "}
              <Link className="text-blue-500" href="mailto:will@willkerry.com">
                contact Will
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ContactFormFailedEmail;
