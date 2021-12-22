import Link from "next/link";
import TextPage from "@/components/layouts/text-page";

export default function ClubKit() {
  return (
    <TextPage title="Club Kit" ogImage="/assets/og/club-kit.png">
      <p className="lead">
        Are you are thinking of racing this year? If so you will need to get
        some SRC kit so please read on.
      </p>

      <h3>Why do I need SRC kit to race?</h3>

      <p>
        British Rowing rules of racing state that competitors must wear clothing
        in club colours and that the clothing worn by the crew in a boat should
        look similar. Although clubs are more relaxed about this rule during the
        winter head season they do enforce it during the summer regatta season.
        You must be wearing appropriate kit in club colours or else you can be
        disqualified.
      </p>

      <p>
        A crew also gets a strong sense of belonging and togetherness when they
        are all wearing the same kit (and it looks good on photos too!) and it
        is one way that we represent our club at these events in a united front.
        Please be aware that if you do not wear the appropriate kit you may be
        unable to race.
      </p>

      <h3>What is SRC kit?</h3>

      <p>
        Our club colours are navy and white and our club kit normally consists
        of the following items:
      </p>

      <ul>
        <li>
          <strong>All In One</strong> (the one piece lycra) — price range
          typically £40-£50
        </li>
        <li>
          <strong>Technical training tops</strong> (short sleeved and long
          sleeved) — price range typically £25-£35
        </li>
        <li>
          <strong>Splash top</strong> — price range typically £65-£79
        </li>
      </ul>

      <p>
        We get our race kit from rowing clothing suppliers (Godfrey,
        JL/Crewroom, Stitch and CSS) and it is custom made for us. Rowing kit is
        designed to be close fitting (so it doesn’t get in the way of your
        hands/ oars) and is made using technical fabrics (to ‘wick’ away
        moisture in order to keep you dry and warm). Prices of the various items
        of kit vary due to discounts applied on the volume of our order.
      </p>

      <h3>What kit do I need to buy in order to race?</h3>

      <p>
        As a minimum anyone racing in J15 and upwards (so that includes novice,
        intermediate or veteran) must have an SRC all in one for racing.
      </p>

      <p>
        It may be difficult to get all in ones for our younger juniors, due to
        their size, so anyone racing in the J10-J14 age groups are not required
        to have an all in one BUT we do suggest you consider purchasing a SRC
        ‘training’ all in one. When racing these younger juniors will still need
        to be wearing club colours and co-ordinated with the rest of the crew so
        we are asking that they race in SRC technical tops (or other suitable
        tops in the correct colour).
      </p>

      <p>
        Most Sudbury rowers have both white and navy tops in both short and long
        sleeves in their kit bags, this allows them to cater for every
        eventuality.
      </p>

      <h3>Okay, I know what I want to buy — what do I do now?</h3>

      <p>
        I am already aware of some requests for all in ones, tech tops and
        splash tops but for me to negotiate the best deal I need to know who
        else out there wants kit. So, please email me (
        <a href="mailto:kit@sudburyrowingclub.org.uk">Amelia Moule</a>) back and
        let me know what you are after. At this stage I do not require any size
        information or money.
      </p>

      <p>
        If anyone is after any other items of kit not mentioned above such as
        gilets, leggings or baseball caps please also let me know and I can
        enquire about whether discounts are available. Because the kit is custom
        made it can take between 4-8 weeks to arrive.
      </p>

      <h3>What if I am going to race before the SRC kit arrives?</h3>

      <p>
        Talk to your vice captains in plenty of time and we can advise you on
        what is best. You will need to wear clothing in club colours and we will
        need to ensure that you co-ordinate with the rest of your crew.
      </p>

      <h3>What about kit for training in?</h3>

      <p>
        Rowers always need training kit, you soon learn you can never have too
        much!
      </p>

      <p>
        You can add to your own selection of training kit by purchasing items
        direct from rowing clothing suppliers mentioned below but you can also
        find items such as technical tops, leggings and shorts at any sports
        shop (try to get ones that have a longer back so you don’t get a cold
        patch when rocking over).
      </p>

      <p>
        Although you can choose whatever colour kit you like for training in we
        do advise that single scullers and those in the bow seat of a un-coxed
        boat should wear white (or hi-vis) tops so they can be seen. Also, if
        you get getting training kit in navy or white it means you may be able
        to use it when racing — bonus!
      </p>

      <ul>
        <li>
          <Link href="http://www.css-rugby.co.uk/Sudbury-Rowing-Club">
            CSS Rugby
          </Link>
        </li>
        <li>
          <Link href="https://www.stitchrowing.com/">Stitch</Link>
        </li>
        <li>
          <Link href="https://rivalkit.com/collections/sudbury-rowing-club">
            RivalKit
          </Link>
        </li>
      </ul>

      <p>If you have any further questions please ask!</p>

      <div className="pt-16 text-sm text-gray-500">
        <p>
          Written by Katherine Cass in 2010.
          <br />
          Updated 2021.
        </p>
      </div>
    </TextPage>
  );
}
