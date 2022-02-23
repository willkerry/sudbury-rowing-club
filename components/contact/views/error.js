import Obfuscate from "react-obfuscate";
import PropTypes from "prop-types";
import Note from "@/components/stour/note";
import { EMAIL } from "@/lib/constants";

export default function Error({ error, message }) {
  const mailto = (
    <Obfuscate email={EMAIL} headers={{ body: message }}>
      email us
    </Obfuscate>
  );
  return (
    <Note label="Error" type="error">
      We were unable to send your message. Please try again later or {mailto}.{" "}
      <code>{error}</code>
    </Note>
  );
}
Error.propTypes = {
  error: PropTypes.string.isRequired,
  message: PropTypes.string,
};
Error.defaultProps = {
  message: "",
};
