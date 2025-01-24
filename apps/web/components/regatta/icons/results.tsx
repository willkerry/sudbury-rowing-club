import { useTranslations } from "next-intl";
import { type Icon, defaultProps } from "./defaultProps";

const ResultsIcon = (props: Icon) =>  {
const t = useTranslations("../components/regatta/icons");

return (
  <svg {...defaultProps} {...props}>
    <title>{t('results')}</title>
    <path d="M16 31H6a1 1 0 01-1-1V9l7.2-8H27c.6 0 1 .4 1 1v15m-8.5 12v-6.5M22 29v-2.5m3 2.5v-9m3 9v-6" />
  </svg>
)
};

export default ResultsIcon;
