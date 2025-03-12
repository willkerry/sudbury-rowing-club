import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Success = () => (
  <Alert variant="success">
    <AlertTitle>Message sent</AlertTitle>
    <AlertDescription>
      Thank you for your message. We will get back to you as soon as possible.
    </AlertDescription>
  </Alert>
);

export default Success;
