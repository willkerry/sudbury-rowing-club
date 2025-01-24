import { useTranslations } from "next-intl";
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
  <span className="my-2 block font-medium text-gray-500 text-sm">
    {children}
  </span>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <span className="block font-medium text-gray-900 text-sm">{children}</span>
);

const LT = () => <span className="text-gray-400">&lt;</span>;
const GT = () => <span className="text-gray-400">&gt;</span>;
const RightArrow = () => <span className="text-gray-400">&rarr;</span>;
const Quote = ({ value }: { value: string }) => (
  <>
    <span className="text-gray-400">&lsquo;</span>
    {value}
    <span className="text-gray-400">&rsquo;</span>
  </>
);

export const ContactFormEmail = ({
  toName = "Per Person",
  toEmail = "per@person.com",
  toRole = "Chairperson",
  fromName = "From Person",
  fromEmail = "from@person.com",
  message = "Hello, this is a message\n\nIt has come to my attention that you are a person. This is a good thing, as I am also a person. We should meet up and do person things together.\n\nRegards,\n\nPerson",
}: ContactFormEmailProps) =>  {
const t = useTranslations("../emails");

return (
  <Html>
    <Head />

    <Tailwind>
      <Body className="mx-auto my-auto bg-white py-4 font-sans ">
        <Container>
          <Heading className="font-normal text-black text-lg">{t('message-received-via-src-contact')}</Heading>

          <Section>
            <Text>
              <Label>{t('from-label')}</Label>
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
              <Label>{t('to-label')}</Label>
              <Value>
                <Quote value={toRole} /> <RightArrow /> {toName}{" "}
                <span>
                  <LT />
                  {toEmail}
                  <GT />
                </span>
              </Value>
            </Text>

            <Row>
              <Column>
                <Label>{t('message-label')}</Label>
                <div
                  className="m-0 rounded border border-gray-200 border-solid bg-gray-50 p-2 text-gray-900 text-sm"
                  dangerouslySetInnerHTML={{ __html: snarkdown(message) }}
                />
              </Column>
            </Row>
          </Section>

          <Section className="mt-8">
            <Hr className="border-gray-200" />
            <Text className="font-medium text-gray-600 text-xs">{t('sent-using-contact-form', { "component0": <Link
                className="text-blue-500"
                href="https://sudburyrowingclub.org.uk/contact"
              >{t('sent-using-contact-form_component0')}</Link>, "component1": <Link className="text-blue-500" href="mailto:will@willkerry.com">{t('sent-using-contact-form_component1')}</Link> })}
              
              </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)
};

export default ContactFormEmail;
