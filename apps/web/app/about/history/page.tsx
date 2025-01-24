import { useTranslations } from "next-intl";
import TextPage from "@/components/layouts/text-page";
import { createMetadata } from "@/lib/create-metadata";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import regatta1888Image from "public/assets/history/1888-regatta.jpg";
import bridge1900sImage from "public/assets/history/1900s-bridge.jpg";
import river1920sImage from "public/assets/history/1920s-river.jpg";
import aerial1936Image from "public/assets/history/1936-aerial.jpg";
import rowers1940sImage from "public/assets/history/1940s-rowers.jpg";
import henley2002Image from "public/assets/history/2002-henley.jpg";
import reachPreWw1Image from "public/assets/history/reach.jpg";

export const metadata = createMetadata({
  title: "History",
  description: "A history of Sudbury Rowing Club",
});

const History: NextPage = () =>  {
const t = useTranslations("about/history");

return (
  <TextPage title="Club History">
    <p className="lead">{t('sudbury-rc-history')}</p>

    <p>{t('sudbury-boat-club-existence')}</p>

    <p>{t('nicholls-boat-supply')}</p>
    <figure>
      <Image
        src={regatta1888Image}
        alt={t('sudbury-amateur-sports-1888')}
      />
      <figcaption>{t('sudbury-amateur-sports-1888-details')}</figcaption>
    </figure>
    <p>{t('regatta-1873-evidence')}</p>

    <p>{t('annual-boat-races-1904')}</p>
    <figure>
      <Image
        src={river1920sImage}
        alt={t('pleasure-boating-1920s')}
      />
      <figcaption>{t('pleasure-boating-1920s-details')}</figcaption>
    </figure>
    <p>{t('boat-race-course-details')}</p>

    <p>{t('club-competitions-1904')}</p>

    <p>{t('regatta-1904-1923')}</p>
    <figure>
      <Image
        src={bridge1900sImage}
        alt={t('ladies-bridge-edwardian-photo')}
      />
      <figcaption>{t('ladies-bridge-photo-details')}</figcaption>
    </figure>
    <p>{t('sudbury-regatta-social-1920s')}</p>

    <p>{t('sudbury-town-band-disaster')}</p>

    <p>{t('spectator-excitement-racing')}</p>

    <p>{t('regatta-course-changes-1930s')}</p>

    <h2>{t('deuchar-cup-1923')}</h2>

    <p>{t('deuchar-cup-competition-details')}</p>

    <p>{t('stour-bc-deuchar-cup-success')}</p>

    <h2>{t('ladies-admission-1926')}</h2>

    <p>{t('ladies-club-friction')}</p>

    <h2>{t('disaster-1931')}</h2>

    <p>{t('boathouse-fire-blessing')}</p>
    <figure>
      <Image
        src={aerial1936Image}
        alt={t('aerial-view-quay-lane-1936')}
        className="flex"
      />
      <figcaption>{t('aerial-view-quay-lane-details')}</figcaption>
    </figure>
    <p>{t('new-boathouse-opening-1932')}</p>
    <figure>
      <Image
        src={rowers1940sImage}
        alt={t('victorious-crew-1940s')}
      />
      <figcaption>{t('victorious-crew-details')}</figcaption>
    </figure>
    <p>{t('ladies-rejoining-club-1950s')}</p>

    <h2>{t('stour-straightening-1955')}</h2>

    <p>{t('club-facilities-improvements-1955')}</p>

    <figure>
      <Image
        src={reachPreWw1Image}
        alt={t('pre-ww1-bridge-view')}
      />
      <figcaption>{t('pre-ww1-bridge-view-details')}</figcaption>
    </figure>

    <p>{t('boathouse-site-lease-1956')}</p>

    <p>{t('club-financial-challenges-1960s')}</p>

    <h2>{t('new-start-1980s')}</h2>

    <p>{t('club-renaming-and-upgrades')}</p>

    <p>{t('current-rowable-course')}</p>

    <p>{t('new-clubhouse-opening-1999')}</p>

    <h2>{t('henley-2001')}</h2>

    <figure>
      <Image
        src={henley2002Image}
        alt={t('henley-pair-carrying-2002')}
      />
      <figcaption>{t('henley-pair-carrying-details')}</figcaption>
    </figure>

    <p>{t('first-henley-race-2001')}</p>

    <div className="pt-16 text-gray-500 text-sm">
      <p>{t('written-by-trevor-chambers')}<br />{t('updated-by-simon-white')}</p>
      <p>{t('image-sources-sudbury-archive', { "component0": <a href="https://photoarchive.sudburyheritagecentre.co.uk">{t('image-sources-sudbury-archive_component0')}</a> })}
        </p>
    </div>

    <div className="pt-8 text-gray-500 text-sm">
      <h2 className="mb-0 font-medium text-base">{t('see-also')}</h2>
      <Link className="block" href="/150">{t('150th-anniversary-gallery')}</Link>
      <Link className="block" href="./history/committees">{t('committee-archive')}</Link>
    </div>
  </TextPage>
)
};

export default History;
