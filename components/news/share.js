import { Linkedin, Twitter, Facebook } from "react-feather";
import { BASE_URL } from "@/lib/constants";
import propTypes from "prop-types";

export default function Share({ path, title, summary }) {
  const url = `${BASE_URL}${path.substring(1)}`;
  return (
    <div className="flex gap-1 mt-0.5">
      <a
        href={`https://twitter.com/intent/tweet?text=${title}&url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on Twitter"
      >
        <Twitter
          className="w-4 h-4"
          style={{ color: "#1da1f2", fill: "currentcolor" }}
          strokeWidth={1}
        />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on Facebook"
      >
        <Facebook
          className="w-4 h-4"
          style={{ color: "#3b5998", fill: "currentcolor" }}
          strokeWidth={1}
          color="#3b5998"
        />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}&source=${BASE_URL}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on LinkedIn"
      >
        <Linkedin
          className="w-4 h-4"
          style={{ color: "#0077b5", fill: "currentcolor" }}
          strokeWidth={1}
        />
      </a>
    </div>
  );
}

Share.propTypes = {
  path: propTypes.string.isRequired,
  title: propTypes.string,
  summary: propTypes.string,
};
Share.defaultProps = {
  title: "",
  summary: "",
};