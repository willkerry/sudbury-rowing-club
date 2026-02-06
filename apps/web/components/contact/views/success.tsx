import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Success = ({ messageId }: { messageId?: string | null }) => (
  <Alert variant="success">
    <AlertTitle>Message in flight</AlertTitle>
    <AlertDescription>
      <p>
        Thank you for your message. We will get back to you as soon as possible.
      </p>
      {messageId && (
        <p className="pt-2 font-medium font-mono text-xs">
          Message ID: {messageId}
        </p>
      )}
    </AlertDescription>
  </Alert>
);
