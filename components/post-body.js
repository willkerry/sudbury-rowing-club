import PropTypes from "prop-types";
import Text from "./stour/text";

export default function PostBody({ content }) {
  return (
    <div className="mx-auto max-w-prose">
      <Text portableText lead>
        {content}
      </Text>
    </div>
  );
}

PostBody.propTypes = {
  content: PropTypes.arrayOf(PropTypes.object).isRequired,
};
