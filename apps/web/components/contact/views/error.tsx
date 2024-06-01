import Note from "@/components/stour/note";
import { EMAIL } from "@/lib/constants";
import { Obfuscate } from "@south-paw/react-obfuscate-ts";

interface Props {
  error: string;
  message?: string;
}

const Error = ({ error, message }: Props) => {
  const mailto = new URLSearchParams(EMAIL);

  if (message) {
    mailto.append("body", message);
  }

  return (
    <Note label="Error" type="error">
      We were unable to send your message. Please try again later or{" "}
      <Obfuscate email={mailto.toString()}>email us</Obfuscate>.{" "}
      <div className="mt-2 mb-0 bg-transparent p-0 font-medium text-black text-sm">
        <code>{error}</code>
      </div>
    </Note>
  );
};

export default Error;
