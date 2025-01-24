import { useTranslations } from "next-intl";
import Note from "@/components/stour/note";

const Success = () =>  {
const t = useTranslations("../components/contact/views");

return (
  <Note label={t('message-sent')} type="success">{t('thank-you-for-your-message')}</Note>
)
};

export default Success;
