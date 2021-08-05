import TextPage from "@/components/layouts/text-page";
import Image from "next/image";

import boathouseImage from "public/assets/members/boathouse.png";

export default function Rules() {
  return (
    <TextPage title="Members’ Resources">
      <Image src={boathouseImage} placeholder="blur" alt="" />
      <p className="lead">
        Although early records have been lost, it is known that Sudbury RC,
        formerly Stour BC, was formed some time before 1873, but ceased to
        function during a period from that time until 1883 when in May of that
        year two meetings took place at the Anchor Hotel in Sudbury, when it was
        proposed and agreed that the Boat Club be reformed. The Treasurer’s
        books for the old Club for the years from 1877 to 1881 were produced
        showing a credit balance of 14/6d (72.5p).
      </p>
    </TextPage>
  );
}
