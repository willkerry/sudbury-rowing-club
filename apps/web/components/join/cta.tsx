import { Link as ScrollLink } from "react-scroll";
import Button from "@/components/stour/button";
import Link from "@/components/stour/link";

const JoinCTA = () => (
  <div className="grid gap-12 rounded border bg-gray-100 p-12 shadow-lg md:grid-cols-2">
    <div>
      <p className="text-center">
        <span className="text-xl font-medium text-gray-800">
          New to the sport?
        </span>
        <br />
        <span className="text-gray-500">
          Our Learn to Row programme is for you.
        </span>
      </p>
      <span className="block h-6" />
      <div className="flex justify-center">
        <ScrollLink duration={300} offset={-30} smooth spy to="l2r">
          <Button size="large" variant="secondary">
            Learn to Row
          </Button>
        </ScrollLink>
      </div>
    </div>
    <div>
      <p className="text-center">
        <span className="text-xl font-medium text-gray-800">
          Already an active rower?
        </span>
        <br />
        <span className="text-gray-500">
          Contact a vice-captain for more information.
        </span>
      </p>

      <span className="block h-6" />
      <div className="flex justify-center">
        <Button as={Link} href="/contact" size="large">
          Contact a Vice-Captain
        </Button>
      </div>
    </div>
  </div>
);

export default JoinCTA;
