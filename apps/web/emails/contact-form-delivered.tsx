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

interface ContactFormDeliveredEmailProps {
  fromName?: string;
  message?: string;
  toName?: string;
  toRole?: string;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="my-2 block font-medium text-gray-500 text-sm">
    {children}
  </span>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <span className="block font-medium text-gray-900 text-sm">{children}</span>
);

const RightArrow = () => <span className="text-gray-400">&rarr;</span>;
const Quote = ({ value }: { value: string }) => (
  <>
    <span className="text-gray-400">&lsquo;</span>
    {value}
    <span className="text-gray-400">&rsquo;</span>
  </>
);

export const ContactFormDeliveredEmail = ({
  toName = "Per Person",
  toRole = "Chairperson",
  fromName = "From Person",
  message = "Hello, this is a message\n\nIt has come to my attention that you are a person. This is a good thing, as I am also a person. We should meet up and do person things together.\n\nRegards,\n\nPerson",
}: ContactFormDeliveredEmailProps) => (
  <Html>
    <Head />

    <Preview>We’ve delivered your message to Sudbury Rowing Club</Preview>

    <Tailwind>
      <Body className="font-sans">
        <Container>
          <Heading className="font-normal text-black text-lg">
            We’ve delivered your message, {fromName}
          </Heading>

          <Text className="text-gray-700 text-sm">
            {toName} will reply to you directly.
          </Text>

          <Section>
            <Text>
              <Label>Delivered to:</Label>
              <Value>
                <Quote value={toRole} /> <RightArrow /> {toName}
              </Value>
            </Text>

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

export default ContactFormDeliveredEmail;
