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

const History: NextPage = () => (
  <TextPage title="Club History">
    <p className="lead">
      Although early records have been lost, it is known that Sudbury RC,
      formerly Stour BC, was formed some time before 1873, but ceased to
      function during a period from that time until 1883 when in May of that
      year two meetings took place at the Anchor Hotel in Sudbury, when it was
      proposed and agreed that the Boat Club be reformed. The Treasurer’s books
      for the old Club for the years from 1877 to 1881 were produced showing a
      credit balance of 14/6d (72.5p).
    </p>

    <p>
      In 1883 the Sudbury Boat Club was already in existence with the
      headquarters at Nicholls boathouse, which was situated at the head of the
      stream leading to Meadow Lane (over the years the stream became totally
      silted up and was partly excavated by the River Stour Trust in 1982).
    </p>

    <p>
      It was Mr Nicholls who offered to supply to the the Stour Boat Club two
      four oared boats, one sculling boat, two canoes and two pair oared boats
      for 10/6d (52.5p) per annum per member, payable in advance. At the next
      meeting of the club, however, it was decided to purchase the boats, and Mr
      Nicholls agreed to accept the sum of £45. He also agreed to let the
      payment extend to two years, upon the money being guaranteed by the
      Committee.
    </p>
    <figure>
      <Image
        src={regatta1888Image}
        alt="The annual ‘Sudbury Amateur Sports, Bicycle and Boat Races’ taking place on the sports field in Quay Lane and the river beyond. Here the camera has caught one of the special attractions in 1888 – the town Postmaster, Mr Hills, making a balloon ascent from the field. The balloon was filled with gas provide by the gas works just across the Lane; the balloon later landed safely at Newton Green."
      />
      <figcaption>
        The annual ‘Sudbury Amateur Sports, Bicycle and Boat Races’ taking place
        on the sports field in Quay Lane and the river beyond. Here the camera
        has caught one of the special attractions in 1888 – the town Postmaster,
        Mr Hills, making a balloon ascent from the field. The balloon was filled
        with gas provide by the gas works just across the Lane; the balloon
        later landed safely at Newton Green.
      </figcaption>
    </figure>
    <p>
      It is known that a regatta was held on 7 June 1873, but the only evidence
      of this is the existence of a presentation prize made to a member of the
      winning Scratch Four. There is no record of what happened during the
      intervening years, but in June 1883, just a month after the club was
      reformed, it was proposed that a challenge should be sent to Sudbury Boat
      Club for races in tub and outrigged fours, tub pairs and sculling boats,
      to take place on August Bank Holiday commencing at 9:30am. The course to
      be from the old island and ending at the bottom of the reach.
    </p>

    <p>
      This event seems to have taken place for several years, with either one
      club or the other offering the Challenge and it is not until 1904 that a
      press cutting reveals that “The main question that had been agitating the
      good people of Sudbury for the past week was whether it was going to be
      fine on the August bank holiday, the day of the annual boat races. King
      Sol made a welcome reappearance in a sky of cerulean blue, speckled with a
      few light clouds”.
    </p>
    <figure>
      <Image
        src={river1920sImage}
        alt="An image thought to date from the 1920s of pleasure boating on the river
          – probably looking downstream from the vicinity of the railway bridge
          towards the cut (on the left) leading to The Quay and Friars Meadow
          beyond."
      />
      <figcaption>
        An image thought to date from the 1920s of pleasure boating on the river
        – probably looking downstream from the vicinity of the railway bridge
        towards the cut (on the left) leading to The Quay and Friars Meadow
        beyond.
      </figcaption>
    </figure>
    <p>
      The course was over the stretch of river between the further island below
      Lady’s Bridge and the top of the reach near Allen’s brickyard. Owing to
      the narrowness of the river two winning posts were used, one fifty yards
      behind the other, the starting posts being similarly placed. This is the
      first time any visiting club have been mentioned but the Naiad RC of
      Ipswich competed in the Challenge Fours, Senior Sculls and the Open Pairs.
    </p>

    <p>
      During 1904 the Club competed at Ipswich against Naiad RC and the Petrels
      RC. They also rowed at Wivenhoe and Rowhedge Regattas and entered an event
      termed a Rowing Match for four-oared Galleys not exceeding 40ft in length
      (open to all England).
    </p>

    <p>
      Records have been lost for the years 1904 to 1923 but during those years
      the Club must have continued its own Regatta and visited those at Ipswich
      and St Ives in Huntingdonshire.
    </p>
    <figure>
      <Image
        src={bridge1900sImage}
        alt="An Edwardian photograph of Ladies’s Bridge, which crossed from Lady Island to the Essex bank and collapsed in the 1930s."
      />
      <figcaption>
        An Edwardian photograph of Ladies’s Bridge, which crossed from Lady
        Island to the Essex bank and collapsed in the 1930s.
      </figcaption>
    </figure>
    <p>
      During the 1920s the Sudbury Regatta was quite a social occasion on August
      Bank Holiday with spectators lining both sides of the Reach, for in those
      days access was gained to the river bank either via Lady’s Bridge to the
      Essex side or Friars Meadow to the Suffolk side. The Sudbury Town Band
      played throughout the afternoon and in the evening at a Promenade concert
      held on the Essex bank.
    </p>

    <p>
      On one of the memorable occasions during those years was the time the
      Sudbury Town Band was being ferried in a punt across the river when the
      bottom of the boat collapsed and they all finished in the river with their
      instruments. Members of the Club made repeated dives , and eventually all
      but one of the instruments were retrieved, so with a little drying out of
      both the bandsmen and instruments ‘the band played on’.
    </p>

    <p>
      What made the racing exciting for the spectators was the station rowing,
      which has already been mentioned. It meant neither the spectators or the
      competing crews, having started fifty yards apart, could tell who was
      winning, and with a course of about mile with at least six bends and
      Lady’s Bridge to negotiate, where bow side had to almost ship their
      blades, it sometimes finished in a dead heat if one of the finishing
      judges was a bit trigger happy and fired his gun early.
    </p>

    <p>
      This course for the Regatta continued to be used until the early 1930’s
      when Lady’s Bridge started to collapse. A shorter course of just over a
      quarter of a mile was used starting from what was known as Sewer Corner,
      but still with station rowing as the river was still too narrow to row
      abreast.
    </p>

    <h2>1923, The Deuchar Cup</h2>

    <p>
      In 1923 The Deuchar Cup Competition was introduced which involved a race
      over a two mile course for the Championship of Suffolk and Norfolk. Heats
      were held between the Suffolk crews of Stour BC, Naiads RC and Orwell
      Works RC and rowed on the River Orwell whilst the Norfolk heats were held
      between Norwich Amateur RC, Yare RC and Life Office RC (now Norwich Union
      RC), the winners of each heat to meet in the final to be rowed in Norwich
      in the first year and subsequently in the county of the club that won the
      previous year’s final.
    </p>

    <p>
      Stour BC managed to reach the final on several occasions but it was not
      until 1926 that they won the trophy. The competition continued through the
      years but it was not until 1948, when Stour BC was the only rowing club in
      Suffolk, that success was again achieved.
    </p>

    <h2>1926, Ladies</h2>

    <p>
      In 1926, after much deliberation and heart searching, ladies were admitted
      to the Club for the first time. This was not an altogether popular
      decision and led to a certain amount of friction between the male members.
      But for about four years the ladies played their part in the club’s
      affairs and entered events such as mixed pairs and double sculls at the
      annual Regatta. One event which did not go down very well with the ladies
      was the time they came back to the boathouse after practice to find their
      undies flying at half mast from the flag pole. You just did not do those
      sort of things in those days.
    </p>

    <h2>1931, Disaster</h2>

    <p>
      What happened on the Sunday evening of the 26 July 1931 was both a
      disaster and a blessing. The disaster was that the boathouse with all its
      equipment was completely destroyed by fire, just 7 days before the annual
      regatta. Members had been working on the very old heavy boats for weeks,
      getting them in good repair for August Bank Holiday, and there was many a
      broken heart when the news was heard. However, the Regatta went ahead as
      planned, boats and oars were borrowed from Banhams of Cambridge, St. Ives
      and the two now defunct Ipswich clubs, so enabling the event to go ahead.
      After the Regatta was over everyone realised that it had been a blessing
      in disguise, for the old boathouse and boats were in a shocking state, and
      were reaching the end of their days. After the fire claim of £762 had been
      settled the next job was to rebuild and restock. Tenders were sent out for
      a new boathouse and one of £256 was accepted from T G Sutton. Boats and
      equipment to the value of £506 were ordered from Banhams of Cambridge and
      Bowers &amp; Phelps of Putney.
    </p>
    <figure>
      <Image
        src={aerial1936Image}
        alt="A 1936 aerial view of the Quay Lane gasworks. The then-new boathouse is at the bottom of frame. "
        className="flex"
      />
      <figcaption>
        A 1936 aerial view of the Quay Lane gasworks. The then-new boathouse is
        at the bottom of frame.
      </figcaption>
    </figure>
    <p>
      The new boathouse was completed by February 1932, the new boats received
      and an opening ceremony was performed by the Mayoress on 16 March. It was
      then best-equipped club in East Anglia and the only one with boats fitted
      with swivel rowlocks. With this advantage the Club attracted a lot of new
      members and over the following years they managed to win many events both
      at home and away regattas. This continues up the time of the outbreak of
      war in 1939 when, an enthusiastic nucleus kept the club running until 1946
      when some of the pre-war members returned to try and pick up where they
      had left off in 1939, and quite successful they were for by 1948 they
      swept the board in winning every major rowing event they entered. Sadly,
      within a year most of the older experienced members had retired or left
      the area, and the younger ones who had joined since the war found success
      rather more difficult.
    </p>
    <figure>
      <Image
        src={rowers1940sImage}
        alt="A victorious crew poses in front of the clubhouse doors, probably in the 1940s."
      />
      <figcaption>
        A victorious crew poses in front of the clubhouse doors, probably in the
        1940s.
      </figcaption>
    </figure>
    <p>
      It is surprising that at the time the clubhouse was rebuilt no
      consideration was given to the possibility of ladies again joining the
      club. When ladies were again admitted in the early 1950s part of the
      boathouse was adapted for their use. The second advent of ladies into the
      club proved much more successful than the first for from the beginning
      they became keenly involved in running the social side of the club. The
      catering side of all events including the Regatta could be safely left in
      their hands, and at the same time, they had two very useful crews on the
      river who could, at times, compete with some of the best in the country.
      It is safe to say that during a very difficult period in the club’s
      history during the 1960s and 1970s the ladies made an increasing
      contribution to the rowing as well as the social health of the club and
      played a bid part in keeping the club going.
    </p>

    <h2>1955, The Stour is Straightened</h2>

    <p>
      Over the years the club had suffered from the lack of facilities on the
      river, having only about a quarter of a mile of straight water on which to
      practice, and every club knew that if they could hold Stour over the first
      quarter of a mile, they could wear them down over the, however, was soon
      to come to an end for in 1954, after another bad flooding in part of
      Sudbury, the River Authority decided to straighten and widen the river
      from Ballingdon to Cornard floodgates. When this was completed in 1955 the
      club then had a vastly superior course of 1000 metres with the river now
      70ft wide which meant that at long last boats could row abreast. During
      the following years the club organised very successful regattas but the
      club, as usual, was suffering from lack of funds to renew the ageing
      equipment and, consequently, had very little success in winning events.
      There was a continual turnover of membership for one reason or another,
      but it resulted in very few reaching senior status which was unfortunate
      so far as competition such as the the Duechar Cup was concerned. As we
      were unable to enter a crew for a year or so the trophy went to Norfolk by
      default.
    </p>

    <figure>
      <Image
        src={reachPreWw1Image}
        alt="A pre-WW1 view of the bridge taken looking downstream along ‘The Reach’ from the vicinity of Friars Meadow.The photo brings out the meandering nature of the old river course, often the cause of flooding in the low-lying parts of the town. The channel was straightened and meanders cut through after WW2. Before that I the bridge led directly onto the Essex bank, not as today onto an island."
      />
      <figcaption>
        A pre-WW1 view of the bridge taken looking downstream along ‘The Reach’
        from the vicinity of Friars Meadow. The photo brings out the meandering
        nature of the old river course, often the cause of flooding in the
        low-lying parts of the town. The channel was straightened and meanders
        cut through after WW2. Before that I the bridge led directly onto the
        Essex bank, not as today onto an island.
      </figcaption>
    </figure>

    <p>
      Prior to 1956 the site of the boathouse had been on lease, but as a a
      result of Sudbury Town Football Club purchasing the Priory Meadow, that
      club had very generously conveyed free of charge all that part of the
      Meadow running parallel to the end of the Quay and to include the
      Boathouse site. It had long been the hope of members over the years to
      build on this site a new boathouse or boathouse cum clubroom but rowing
      being so expensive a sport to run, it was never possible to generate more
      cash than was needed for the upkeep of the boathouse and equipment.
    </p>

    <p>
      With continually rising costs for equipment during the 1960s and 1970s the
      club managed to keep its head above water, though with reduced membership,
      as interest in rowing in the area was sadly lacking.
    </p>

    <h2>1980-, A New Start</h2>

    <p>
      After a period of years of inactivity the club became active again with
      the arrival of some new members who updated the equipment and boathouse.
      Around 1982 the single changing room that had been shared by both men and
      women, using a rota system, was extended to provide separate rooms with
      individual shower and toilet facilities. It was during this time that the
      club was renamed Sudbury RC to more closely link it to the town and
      encourage more local people to join. When Alton Blades RC were forced by
      the council to move from Alton water near Ipswich, they amalgamated with
      the club, thus further boosting the boat fleet and membership.
    </p>

    <p>
      The current rowable course is 1500m long, the regatta being held on the
      middle 650m of it, starting downstream of Lady Island nature reserve and
      finishing at the top of the meadow.
    </p>

    <p>
      On 29 May 1999 the new clubhouse was opened as part of the club’s 125th
      birthday celebrations. The new building included changing facilities and
      room for meeting socially in the dry and warm allowing the club to widen
      its appeal to a greater number of people in the community. This day marked
      the culmination of a five year project that would not have been possible
      without significant funding from The National Lottery, The Sports Aid
      Foundation, Sudbury Common Lands Trust, Sudbury Freeman’s Trust and
      Babergh District Council. Later on 11 September 1999 the old changing
      rooms at the back end of the boathouse were demolished to provide much
      needed additional boat storage space to house the inventory of 3 eights, 5
      fours, 2 doubles, 3 coxless pairs and the numerous single sculls of the
      time.
    </p>

    <h2>2001, Henley</h2>

    <figure>
      <Image
        src={henley2002Image}
        alt="Sam Hogsbjerg and Aidan Dunn carrying their pair at Henley in 2002."
      />
      <figcaption>
        Sam Hogsbjerg and Aidan Dunn carrying their pair at Henley in 2002.
        Image source: SRC Archive.
      </figcaption>
    </figure>

    <p>
      It was not until 2001 that Peter Gostling became the first member of SRC
      to race at Henley in SRC colours, when he sculled as part of a composite
      crew in the Fawley Cup for Junior quads. In the following year Aidan Dunn
      and Sam Hogsbjerg added to this by becoming the first crew from the club
      to race at the event when they competed in the Silver Goblets and Nichols
      Cup for coxless pairs.
    </p>

    <div className="pt-16 text-gray-500 text-sm">
      <p>
        Written by Trevor Chambers in 1996.
        <br />
        Updated by Simon White in March 2006.
      </p>
      <p>
        Images courtesy of{" "}
        <a href="https://photoarchive.sudburyheritagecentre.co.uk">
          Sudbury Heritage Photo Archive
        </a>{" "}
        unless otherwise noted.
      </p>
    </div>

    <div className="pt-8 text-gray-500 text-sm">
      <h2 className="mb-0 font-medium text-base">See also</h2>
      <Link className="block" href="/150">
        150th anniversary gallery
      </Link>
      <Link className="block" href="committees">
        Committee archive
      </Link>
    </div>
  </TextPage>
);

export default History;
