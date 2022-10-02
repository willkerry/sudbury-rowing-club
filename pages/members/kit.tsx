import TextPage from "@/components/layouts/text-page";
import { Obfuscate } from "@south-paw/react-obfuscate-ts";

const ClubKit = () => (
  <TextPage title="Club Kit" ogImage="/assets/og/club-kit.png">
    <p className="lead">
      Are you are thinking of racing this year? If so you will need to get some
      SRC kit so please read on.
    </p>
    <h3>Our suppliers</h3>
    <ul>
      <li>
        <a href="https://rivalkit.com/collections/sudbury-rowing-club">
          Rival Kit
        </a>
      </li>
      <li>CSS Rugby</li>
      <li>Big Bobble Hats Ltd.</li>
      <li>Perry Blazers</li>
    </ul>
    <h3>Why do I need SRC kit to race?</h3>
    <p>
      British Rowing rules of racing state that competitors must wear clothing
      in club colours and that the all members of the crew should be wearing
      similar or the same kit.
    </p>
    <p>
      Although clubs are more relaxed about this in the winter head season, and
      it is more enforced in the summer regatta season, it is always good to be
      wearing club kit when racing. If you are not wearing appropriate club kit
      you could be at risk of being disqualified.
    </p>
    <p>
      It also instills a sense of belonging and togetherness when everyone is
      wearing the same kit, as well as looking good in photos!
    </p>
    <h3>What is SRC kit?</h3>
    <p>
      Our club colours are navy blue and white, and rowing kit usually consists
      of the following:
    </p>

    <ul className="text-sm">
      <li>
        <strong>All-in-one</strong> (unisuit lycra). Usually priced £45-£65.
      </li>

      <li>
        <strong>Baselayers and technical training tops</strong> (short or long
        sleeved). Usually priced £20-£35.
      </li>

      <li>
        <strong>Splash tops</strong>. Usually priced £60-£80.
      </li>
    </ul>
    <p>
      We get our racing kit from rowing clothing suppliers Rival Kit, and local
      sportswear supplier CSS Rugby, where it is all custom made for us.
    </p>
    <p>
      Rowing kit is design to be tight fitting (for safety, so it doesn’t get in
      your way), and is made from technical sportswear fabrics to wick away
      moisture and keep you dry and warm.
    </p>
    <h3>What kit do I need to buy in order to race?</h3>
    <p>As a minimum anyone racing must wear an SRC racing all-in-one. </p>
    <p>
      Most SRC rowers also have white base layers in both long and short sleeved
      to wear underneath their all-in-one for winter and summer respectively.
    </p>
    <h3>What do I do now?</h3>
    <p>
      Our supplier{" "}
      <a href="https://rivalkit.com/collections/sudbury-rowing-club">
        Rival Kit
      </a>
      , has a website which works as an online shop, allowing individuals to buy
      the kit they want and have it delivered straight to their door, with
      shorter lead times and no bulk order windows. This makes the kit buying
      process much easier for all involved!
    </p>
    <h3>What if I am going to race before my SRC kit arrives?</h3>
    <p>
      Please be aware that the lead times on most items are between 3-6 weeks,
      so make sure you are ordering in plenty of time before your first race! If
      the kit does not arrive in time please speak to me (Amelia Moule) or your
      Vice-Captain, who can advise you on what to wear instead.
    </p>
    <h3>What about training kit?</h3>

    <p>
      Rowers always need training kit and you will soon learn you can never have
      too much!
    </p>
    <p>
      Rival Kit sell a wide range of SRC and general training kit such as base
      layers, splash tops, leggings and all-in-ones. Other rowing specific
      brands selling general rowing kit include Stitch, Crewroom, JL, Powerhouse
      Sport, Five57, and Godfrey. General sports clothing is also ideal for
      training.
    </p>
    <p>
      Although you can choose whatever colour you like for training, we do
      advise that single scullers and those in the bow seat should wear a hi-vis
      top so they can be seen easily by other river users. (Rival Kit have a
      good range of hi-vis items!) Also if you buy training kit in navy blue or
      white it can also be used for racing – bonus!
    </p>
    <p>
      There may also be bulk orders for additional items throughout the year for
      items such as club blazers etc. We are also supplied with bobble hats from
      Big Bobble Hats Ltd. and sell these internally. If you would like to buy a
      bobble hat please let me know.
    </p>
    <p>
      If you have any questions about kit, or any suggestions for new items
      please do not hesitate to{" "}
      <Obfuscate email="kit@sudburyrowingclub.org.uk">contact me</Obfuscate>!
    </p>

    <div className="text-sm bg-gray-100 rounded p-4 grid grid-cols-2 sm:grid-cols-4">
      <span className="font-semibold text-gray-700 inline-block mb-1 col-span-2 sm:col-span-4">
        Useful links
      </span>
      <a href="https://rivalkit.com/">Rival Kit</a>
      <a href="https://stitchrowing.com/">Stitch Rowing</a>
      <a href="https://www.crewroom.co.uk/">Crewroom</a>
      <a href=" https://jlathletics.com/en-gb/collections/rowing-1">
        JL Athletics
      </a>
      <a href="https://www.powerhousesport.com/">Powerhouse Sport</a>
      <a href="https://www.five57sportsgear.com/">Five57</a>
      <a href="https://www.godfrey.co.uk/">Godfrey</a>
    </div>
    <div className="pt-16 text-xs text-gray-500">
      <p>Updated by Amelia Moule 2022.</p>
    </div>
  </TextPage>
);

export default ClubKit;
