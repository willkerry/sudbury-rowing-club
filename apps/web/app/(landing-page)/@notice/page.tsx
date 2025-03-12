import Container from "@/components/layouts/container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchLandingPage } from "@sudburyrc/api";

const LandingNoticePage = async () => {
  const {
    landingPage: { note },
  } = await fetchLandingPage();

  if (!note.display) return null;

  return (
    <Container>
      <Alert variant="default">
        <AlertTitle>{note.label}</AlertTitle>
        <AlertDescription>{note.text}</AlertDescription>
      </Alert>
    </Container>
  );
};

export default LandingNoticePage;
