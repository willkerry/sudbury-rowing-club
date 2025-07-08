import { CommitteeSignature } from "@/components/landing/committee-signature";
import { Sponsors, Affiliates } from "@/components/landing/sponsors";
import { Text } from "@/components/stour/text";
import { fetchLandingPage } from "@sudburyrc/api";

const LandingIntroductionPage = async () => {
  const {
    landingPage: { description },
  } = await fetchLandingPage();

  return (
    <>
      <div className="mx-auto my-16">
        <Text portableText={description} className="mx-auto my-16" />
        <span className="sr-only">The Committee</span>
        <CommitteeSignature aria-hidden className="mx-auto w-48" />
        <Affiliates />
      </div>

      <Sponsors heading="Sponsored by" className="mb-24" />
    </>
  );
};

export default LandingIntroductionPage;
