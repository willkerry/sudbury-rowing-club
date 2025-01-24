import { useTranslations } from "next-intl";
import Container from "@/components/layouts/container";
import { HeroTitle } from "@/components/stour/hero";

const EventsLayout = ({
  children,
  calendar,
}: {
  children: React.ReactNode;
  calendar: React.ReactNode;
}) =>  {
const t = useTranslations("members/events");

return (
  <>
    <HeroTitle prose title={t('competition-calendar')} transparent />
    <Container>{children}</Container>
    <Container>{calendar}</Container>

    <div className="mt-4" />
  </>
)
};

export default EventsLayout;
