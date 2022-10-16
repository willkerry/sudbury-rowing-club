import Button from "../stour/button";
import { Home, Search } from "react-feather";

const CallToAction404 = () => (
  <>
    <p>
      The page you are looking for might have been removed, or might have just
      moved.
    </p>
    <div className="flex flex-col gap-4">
      <Button
        as="a"
        href="https://www.google.com/search?q=site%3Asudburyrowingclub.org.uk"
        icon={<Search />}
        variant="brand"
      >
        Search our site with Google
      </Button>
      <Button as="a" href="/" icon={<Home />}>
        Return to the homepage
      </Button>
    </div>
  </>
);

export default CallToAction404;
