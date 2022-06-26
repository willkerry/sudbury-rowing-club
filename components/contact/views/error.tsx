import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import Note from "@/components/stour/note";
import { EMAIL } from "@/lib/constants";

interface Props {
  error: string;
  message?: string;
}

const Error = ({ error, message }: Props) => {
  const mailto = new URLSearchParams(EMAIL);
  message && mailto.append("body", message);
  return (
    <Note label="Error" type="error">
      We were unable to send your message. Please try again later or{" "}
      <Obfuscate email={mailto.toString()}>email us</Obfuscate>.{" "}
      <code>{error}</code>
    </Note>
  );
};

export default Error;
