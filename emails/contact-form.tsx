import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import snarkdown from "snarkdown";

interface ContactFormEmailProps {
  toName?: string;
  toEmail?: string;
  toRole?: string;
  fromName?: string;
  fromEmail?: string;
  message?: string;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="my-2 block text-sm font-medium text-gray-500">
    {children}
  </span>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <span className="block text-sm font-medium text-gray-900">{children}</span>
);

const InlineValue = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block rounded border border-solid border-gray-200 bg-gray-100 px-1 text-sm font-medium text-gray-800">
    {children}
  </span>
);

const LT = () => <span className="text-gray-400">&lt;</span>;
const GT = () => <span className="text-gray-400">&gt;</span>;

export const ContactFormEmail = ({
  toName = "Per Person",
  toEmail = "per@person.com",
  toRole = "Chairperson",
  fromName = "From Person",
  fromEmail = "from@person.com",
  message = "Hello, this is a message\n\nIt has come to my attention that you are a person. This is a good thing, as I am also a person. We should meet up and do person things together.\n\nRegards,\n\nPerson",
}: ContactFormEmailProps) => (
  <Html>
    <Head />

    <Tailwind>
      <Body className="mx-auto my-auto bg-white py-4 font-sans ">
        <Container>
          <Heading className="text-lg font-normal text-black">
            You have received a message from{" "}
            <InlineValue>{fromName}</InlineValue>
          </Heading>

          <Section>
            <Text>
              <Label>From: </Label>
              <Value>
                {fromName}{" "}
                <span>
                  <LT />
                  {fromEmail}
                  <GT />
                </span>
              </Value>
            </Text>

            <Text>
              <Label>To: </Label>
              <Value>
                {toRole} ({toName}){" "}
                <span>
                  <LT />
                  {toEmail}
                  <GT />
                </span>
              </Value>
            </Text>

            <Row>
              <Column>
                <Label>Message:</Label>
                <Text
                  className="m-0  rounded border border-solid border-gray-200 bg-gray-50 p-2 text-sm text-gray-900"
                  dangerouslySetInnerHTML={{ __html: snarkdown(message) }}
                />
              </Column>
            </Row>
          </Section>

          <Section className="mt-8">
            <Hr className="border-gray-200" />
            <Text className="text-xs font-medium text-gray-600">
              Sent using the{" "}
              <Link
                className="text-blue-500"
                href="https://sudburyrowingclub.org.uk/"
              >
                contact form
              </Link>{" "}
              on the Sudbury Rowing Club website. If you’re experiencing issues
              with this form, please{" "}
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

export default ContactFormEmail;
