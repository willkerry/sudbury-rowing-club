import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        We were unable to send your message. Please try again later or{" "}
        <Obfuscate email={mailto.toString()}>email us</Obfuscate>.
      </AlertDescription>
    </Alert>
  );
};

export default ErrorView;
