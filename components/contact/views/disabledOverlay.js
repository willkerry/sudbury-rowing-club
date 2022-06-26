import { AlertCircle } from "react-feather";
import { EMAIL } from "@/lib/constants";
import Obfuscate from "@south-paw/react-obfuscate-ts";
import PropTypes from "prop-types";

export default function DisabledOverlay({ form }) {
  return (
    <div className="relative">
      <div className="absolute top-0 z-10 flex flex-col items-center justify-center w-full h-full gap-2">
        <p className="flex items-center gap-2 text-lg font-semibold text-gray-600">
          <AlertCircle className="text-yellow-500" />
          Contact form temporarily disabled
        </p>
        <div className="prose">
          <p>
            Contact us on <Obfuscate email={EMAIL} /> instead.
          </p>
        </div>
      </div>
      <div className="blur-[2px] select-none">{form}</div>
    </div>
  );
}
DisabledOverlay.propTypes = {
  form: PropTypes.node.isRequired,
};
