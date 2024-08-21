import Note from "@/components/stour/note";
import { EMAIL } from "@/lib/constants";
import { Obfuscate } from "@south-paw/react-obfuscate-ts";

interface Props {
  error: string;
  message?: string;
}

const ErrorView = ({ error, message }: Props) => {
  const mailto = new URLSearchParams(EMAIL);

  if (message) {
    mailto.append("body", message);
  }

  return (
    <Note label="Error" type="error">
      We were unable to send your message. Please try again later or{" "}
      <Obfuscate email={mailto.toString()}>email us</Obfuscate>.{" "}
      <div className="mb-0 mt-2 bg-transparent p-0 text-sm font-medium text-black">
        <code>{error}</code>
      </div>
    </Note>
  );
};

export default ErrorView;
