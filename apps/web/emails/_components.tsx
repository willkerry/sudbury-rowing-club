import { Body } from "@react-email/body";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Link } from "@react-email/link";
import { Markdown } from "@react-email/markdown";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Tailwind } from "@react-email/tailwind";
import { Text } from "@react-email/text";

export const Label = ({ children }: { children: React.ReactNode }) => (
  <Text className="mt-2 mb-0 text-sm font-medium text-gray-500">
    {children}
  </Text>
);

export const Value = ({ children }: { children: React.ReactNode }) => (
  <Text className="m-0 text-sm font-medium text-gray-900">{children}</Text>
);

export const MessageBody = ({ children }: { children: string }) => (
  <div className="text-sm text-gray-900">
    <Markdown>{children}</Markdown>
  </div>
);

export const RightArrow = () => <span className="text-gray-400">&rarr;</span>;

export const Quote = ({ value }: { value: string }) => (
  <>
    <span className="text-gray-400">&lsquo;</span>
    {value}
    <span className="text-gray-400">&rsquo;</span>
  </>
);

export const LT = () => <span className="text-gray-400">&lt;</span>;
export const GT = () => <span className="text-gray-400">&gt;</span>;

export const ContactFormLink = () => (
  <Link
    className="text-blue-500"
    href="https://sudburyrowingclub.org.uk/contact"
  >
    contact form
  </Link>
);

export const WillLink = ({
  children = "contact Will",
}: {
  children?: React.ReactNode;
}) => (
  <Link className="text-blue-500" href="mailto:will@willkerry.com">
    {children}
  </Link>
);

export const FooterNote = ({ children }: { children: React.ReactNode }) => (
  <Section className="mt-8">
    <Hr className="border-gray-200" />
    <Text className="text-xs font-medium text-gray-600">{children}</Text>
  </Section>
);

export const EmailShell = ({
  preview,
  children,
}: {
  preview: string;
  children: React.ReactNode;
}) => (
  <Html>
    <Head />

    <Preview>{preview}</Preview>

    <Tailwind>
      <Body className="font-sans">
        <Container>{children}</Container>
      </Body>
    </Tailwind>
  </Html>
);
