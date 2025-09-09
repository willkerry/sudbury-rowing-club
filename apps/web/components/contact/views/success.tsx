import type { KyResponse } from "ky";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Success = ({ response }: { response: KyResponse<string> }) => {
  const message = response.statusText;
  const status = response.status;

  if (status === 200) {
    return (
      <Alert variant="success">
        <AlertTitle>Message in flight</AlertTitle>
        <AlertDescription>
          <p>
            Thank you for your message. We will get back to you as soon as
            possible.
          </p>
          <p className="pt-2 font-medium font-mono text-xs">{message}</p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
