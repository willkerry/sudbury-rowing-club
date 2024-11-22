import Container from "@/components/layouts/container";
import Note from "@/components/stour/note";
import { fetchLandingPage } from "@sudburyrc/api";

const LandingNoticePage = async () => {
  const {
    landingPage: { note },
  } = await fetchLandingPage();

  if (!note.display) return null;

  return (
    <Container>
      <Note centered label={note.label} type={note.type}>
        {note.text}
      </Note>
    </Container>
  );
};

export default LandingNoticePage;
