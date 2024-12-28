import type { JSX, SVGProps } from "react";

/**
 * Renders the website wordmark in inlined SVG format. This is the club crest with
 * a wordmark to its right, intended for the header of the website. Be cautious
 * not to use this component in a way that would cause it to be unnecessarily
 * re-rendered.
 */
export const Wordmark = ({
  suppressTitle,
  ...props
}: JSX.IntrinsicAttributes &
  SVGProps<SVGSVGElement> & { suppressTitle?: boolean }) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: element is always aria-hidden when title is not present
  <svg
    viewBox="0 0 302 50"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-hidden={suppressTitle}
  >
    {!suppressTitle && <title>Logo</title>}
    <path d="M29.804 29.492c-.03 5.052.9 8.704-4.575 11.075-1.928 1.02-4.106 2-5.125 4.051-1.189-2.06-3.587-3.12-5.625-4.281-5.214-2.221-4.135-6.133-4.215-10.845h19.54zm-10.949 2.01c-.6-.97-1.428.45-2.128.56-.35.461.54.531.83.501a2.84 2.84 0 01-.44.03c-.39-.05-.68.41-.34.2.13-.13.35-.13.53-.1l-.47.1c.57.13.82.06.89.15.02.44-.9 1.771-.14 2.471.02 1-.11 2.942-1.32 2.862-.739.25.65.68.86.3.64-.73.849-3.262 1.858-1.731-.7 1.37.75 1.8 1.748 1.83-.29.14-3.067.26-2.098.721.79.03 2.818-.12 3.137-.8 0-.49 1.559-.43 2.058-1.651.76-.99.32-2.881-1.099-2.361 2.818-.34.24 5.703-2.198 1.34l-.998-1.82c-.64-.88-.44-1.47-.64-2.441l-.04-.16v-.001z" />
    <path d="M9.657 31.817c.15 1.477-2.046 2.446-.819 3.763.14.429.22.918.35 1.337.43.968-.49.859-1.048.898-.085.47-.743.101-.719.04.01-.1.02-.2 0-.309-.968.529-.09-1.297-.538-1.737.09-1.167 2.444-2.085 1.057-2.395a.523.523 0 01-.21-.509c.14-.868.85-.639 1.228-.43.19-.199-.08-.698.32-.508.17 0 .24-.08.37-.16l.01.01zm21.355-.21c-.718 1.128.47.15.878 1.029.16.399-.28.678-.638.798-.36.13 1.716 1.297 1.886 1.597.16.3.32 2.096 0 2.335-.33.22-.46.1-.729.14-.27.04-.449.21-.519-.07-.828-1.008-.858 1.298-.948-1.437-.1-.569 0-1.218.58-1.417-.7-.659-2.446-2.635-.5-2.974h-.01v-.001zM20.15 13.783c5.07 1.263.21 8.016-2.84 3.918.752-.12 1.525-.199 2.218-.537 1.616.18 1.425-2.039-.14-1.72-.262-.11-1.507-.498-1.707-.696.662-.657 1.405-1.094 2.47-.965z" />
    <path d="M17.71 15.061v.02c.494.18 1.185.448 1.68.617 1.244-.299 1.353 1.383.078 1.174-.632.299-1.313.448-2.005.508-.168.04-.355.1-.514.02-.345-.22-.098-.777.228-.797a1.403 1.403 0 01.02-.875c-1.087-.05-.169-1.383.513-.667zm-.277.796c-.054.206-.065.445.01.647.015.059.078.103.139.09l1.402-.2c.156.028.18-.22.02-.238l-1.403-.398c-.057 0-.168.02-.168.1v-.001zm7.09-7.498c2.072-.12.197 2.687-1.105 2.225-.651.642-1.066 1.454-1.55 2.206-2.052-1.403.79-6.256 2.655-4.431zM8.313 9.477C7.983 5.034 5.626 3.343 3.07 0L0 2.312c2.176 3.242 3.37 6.355 7.26 7.906l1.053-.74v-.001zM40 2.312L36.93 0c-2.336 2.942-5.124 5.554-5.245 9.477l1.053.741c3.52-1.271 5.285-4.844 7.26-7.906H40zM31.588 9.82h-.002l.01-.01-.008.01.848.613-1.62 2.272c-.554.02-1.107.231-1.65.442l2.422-3.326V9.82zm-20.548 3.6L8.414 9.81l-.851.631 1.99 2.778c.5.012.999.08 1.485.2l.002.001zm7.03-.91c.36-1.85-.401-3.55-2.205-4.349v-.01c-.32-.11-.621-.1-.952.27-1.483-.13-1.112 2.66.771 2.34a5.25 5.25 0 011.584 2.03c.21-.17.53-.19.801-.28l.001-.001zM7.27 45.237l-1.152-.82a85.436 85.436 0 00-3.043 4.35c-.67 1.041-.06 1.822.951.641 1.122-1.35 2.243-2.73 3.244-4.171zm3.973-5.472l-1.12-.8c-1.342 1.84-2.623 3.57-3.804 5.171l1.15.83 3.774-5.201zm21.477 5.489l.27.37.941 1.26c.64.83 1.361 1.7 2.042 2.52.97 1.16 1.631.45.96-.61a84.118 84.118 0 00-3.062-4.37l-1.151.83zm.95-1.11l-3.813-5.18-1.1.8 3.763 5.2 1.15-.82zM10.908 13.762c-.315.585-.164 1.267.243 1.76-.152.11-.954 1.003-1.167.824-.21-.177-.137-.659-.147-.915a2.605 2.605 0 01-.78.508c-.196.084-.411.19-.566.42-.035.019-.058.011-.085-.017-.22-.23-.29-.884-.152-1.166l-.258-.152c-.254.362-.312.72-.395 1.006-.102.35-.29.601-.591.805-.087.294.001.714-.119.997-.28-.025-.58-.343-.794-.502.042.347.284 1.663-.12 1.69-.26.018-.556-.458-.713-.633.03.387.115.82.005 1.199a.481.481 0 01-.206.285c-.319.223-.666.364-.96.63-.913-2.392-.21-4.32 1.21-5.529 1.425-1.211 3.58-1.71 5.595-1.21zm-.405 8.622c-.41.482-1.13.985-1.781.664-.233-.342-.666-.908-1.115-.525-.226.192-.385.522-.706.562-.186.024-.47-.048-.919-.407-.003-.224.136-.56.377-.627.474-.13 1.097.355 1.674.185.57-.168.582-.602.893-.957.11.05.195.172.277.258.19-.255.418-.548.334-.887-.094-.376-.46-.433-.682-.678.216-.265.297-.456.342-.789-.177.097-.395.267-.603.263-.124-.003-.201-.176-.27-.262-.16-.198-.3-.175-.477-.287.21-.272.747-.331 1.054-.356.441-.035.928.029 1.329.268 1.229.732 1.055 2.657.273 3.575z" />
    <path d="M5.473 30.89c.096-.194.367-.207.43-.475.123-.523-.465-.938-.362-1.434l.09-.44c-.274.242-1.08.994-1.507.73-.024-.081.053-.195.09-.262.28-.935.254-1.93.544-2.863-.637-1.039-1.172-2.258-1.047-3.506.09-.906.528-1.573 1.097-1.97.57-.4 1.274-.53 1.9-.36.59.16 1.12.586 1.415 1.326a1.746 1.746 0 01-1.19.011c-.522-.189-.927-.103-1.182.168-.243.26-.315.652-.264 1.009.132.923.986 1.296 1.77.808.308-.156.457-.416.695-.637.451.312.406.859.372 1.33.48-.499.869-.566 1.548-.677l-.02 7.452a2.283 2.283 0 01-.59.486c-.329-.225-.578-.765-.612-1.158 0-.007-.247-.07-.29-.082-.134.404-.2.797-.54 1.092-.007.007-.03.033-.034.02.109-.773-.374-.895-.657-1.49l-.285.07c.013.497-1 .886-1.371.852zm29.772-5.445c-.072.182-.293.362-.177.572.566.771.334 1.795.713 2.637-.246.433-1.183.064-1.38-.236l-.274.104c.053.358-.061.724-.192 1.098-.143.362.014.806-.029 1.183-.342-.32-.495-.798-.77-1.17l-.217-.292c-.087.605-.247 1.246-.715 1.68-.162.15-.268.156-.334-.068-.09-.304-.07-.642-.08-.955-.406.616-.84 1.16-1.564 1.423l-.02-7.896c.416-.083.86.055 1.21.273.074-.212.142-.695.383-.746.529.827 1.494.71 2.045-.063.223-.314.358-.714.263-1.052-.131-.463-.63-.578-1.054-.568-.427.186-.983.36-1.434.153-.082-.038-.132-.065-.083-.148.621-1.07 1.843-1.538 3.015-1.218 1.962.976 2.05 3.779.694 5.289zm-13.709-4.843l.007-.003c1.126-.347 2.035.89 2.31 1.827.017.082.027.145.032.192-.306-.205-.58-.464-.93-.594-.74-.276-1.475.385-2.157.587-.442.132-.842.04-1.173-.288l-.216-.215c-.046.364-.102.703-.416.944-.308.235-.972.147-1.308-.055-.26-.155-.29-.432-.345-.702l-.199.212c-.133.142-.856.232-.962.012-.298-.62.97-2.123 1.59-1.854.264.115.297.533.355.785.988-.956 2.199-.536 3.412-.848z" />
    <path d="M28.808 18.711c.597-.753 1.874-1.175 2.78-.71.262.136.497.354.699.687l.001.002.001.002c.091.14-.062.18-.172.245-.343.2-.797.517-1.215.452l-.206-.032c.032.188.074.35-.061.51-.221.262-.564.401-.699.738-.077.193-.066.413.06.672l.284-.081c-.021-.21.387-.435.431-.16.095.587.478.938.974 1.058.474.115 1.044.02 1.573-.249.21.053.292.344.297.532-.37.206-.768.358-1.181.444-.15-.176-.346-.42-.6-.419-.262.003-.437.271-.564.466-1.66-.14-2.663-1.314-2.826-2.493-.082-.6.053-1.197.424-1.664zm5.933.9c.148-.486.15-.958.062-1.453-.229.26-.46.495-.818.559-.16.029-.133-.018-.06-.156v-.002c.415-.816.098-1.783-.045-2.641-.196.5-.387.96-.92 1.196-.075.033-.05-.357-.05-.405.002-.526.007-1.384-.588-2.119l-.263.126c.135.633-.04 1.043-.575 1.398-.03.02-.028.03-.057.007-.46-.38-.632-.994-1.108-1.379.026.413.244 1.209-.359 1.36-.23.058-.483-.267-.672-.367a1.614 1.614 0 00-.301-.534c.386-.48.4-1.12.175-1.661 1.935-.902 4.138-.368 5.567.967 1.419 1.324 2.069 3.43.919 5.69a3.277 3.277 0 00-.907-.586zm-21.372-6.159c.413.547.826 1.03 1.455 1.322.06-.552.56-1.538 1.279-1.295-.205.309-.483.454-.434.874.069.573.546 1.029.834 1.508.125.207.194.38.194.527-.492.424-.356.99.02 1.44.32.38.725.667 1.083 1.007-.215.391-.155.834-.283 1.247-.805.034-1.12 1.093-1.927.905-.228-.053-.36.112-.56.116-.007-.009-.078-.043-.094-.143-.067-.444.078-.879.295-1.258-.544-.107-1.082-.12-1.637-.106-.051-.44.255-.882.64-1.195l-.153-.254c-.217.091-.912.007-1.105-.087-.021-.062 0-.152.003-.217-.25.034-.674.191-.879.014-.06-.052.048-.261.07-.312.124-.285.27-.562.403-.842l-1.344.39c-.19-.17-.222-.424-.118-.678a1.02 1.02 0 01.743-.602l.31-.06-.243-.203a2.08 2.08 0 01-.668-1.079c.01-.376.418-.947.78-1.097.05.545-.012.947.402 1.38l.252-.148c-.074-.245.098-.579.222-.778.081-.132.266-.414.46-.376zm14.576-.383c.328.102.622.456.73.88.158.61-.15 1.002-.642 1.293.666.385.904 1.002.71 1.769-.17.379-1.57-.515-1.812-.656.109.244.236.491.327.744.028.078.04.102-.037.143a4.477 4.477 0 01-1.553.49l.246.225c.3.275.235.801.452 1.13.038.058.1.117.015.13-.628.084-1.286.047-1.85-.221.3.62.26 1.206-.105 1.788-.021.036-.05.053-.092.043-.387-.092-.822-.711-1.122-.972 0 .168.035.383-.026.543-.014.036-.047.023-.078.014-.45-.13-.79-.474-1.292-.463-.275-.359-.434-.696-.324-1.198.008-.035.018-.042.019-.043 1.03-.73 1.469-2.174 1.103-3.367.882-.243 1.29-1.19.916-2.013.655-.282.761.703 1.263.586.58-.136.983-.66 1.196-1.177.617.423.904.986.958 1.704.342-.424.606-.993.998-1.372z" />
    <path d="M24.298 21.473c.663-.317 1.012-.974 1.052-1.694.468-.044 1.171.182 1.53-.193.412-.43-.287-1.07-.226-1.522.372-.22.968-.168 1.175-.618.891.339 1.597.076 1.586-.904a.938.938 0 001.083-.064 1 1 0 00.26-.302c.115.173.23.362.405.48.422.288.896-.192 1.187-.482.038.434-.067 1.083.247 1.414.273.287.703.018.956-.16.023.323.017.631-.108.909-.1.187-.135.365-.1.522a.52.52 0 00.278.35c.188.098.433.107.67.036-.019.085-.042.17-.071.253-1.326-.149-2.288.453-2.972 1.355-.062-.192-.172-.364-.367-.443.157-.132.318-.274.393-.47.517-.12 1-.415 1.419-.664a.491.491 0 00.208-.659c-.663-1.49-2.856-1.655-4.04-.68-.954.788-1.46 2.168-.729 3.518-1.19.011-2.384.106-3.574.039a5.104 5.104 0 01-.262-.02v-.001zm-9.828-1.311c-.015.134-.033.285-.042.426-.013.191-.014.392.025.582v.002l.001.002a.71.71 0 00.207.338h-3.035c.427-1.566-.635-3.485-2.35-3.518-.57-.011-1.282.079-1.73.468-.34.296-.383.772.03.974.095.044.193.08.295.104.168.136.205.36.42.465-.062.44.439.492.658.756-.203.006-.38.131-.506.283a2.652 2.652 0 00-1-1.006 2.63 2.63 0 00-1.54-.333 1.181 1.181 0 01-.04-.102c.12.043.235.053.342.026.497-.125.524-.862.535-1.274.337.075.7.02.752-.382.036-.277-.048-.567.031-.84.146-.15.33-.258.455-.428.069.116.17.209.293.266.42.17.795-.414 1.14-.568.068.199.156.426.342.54.271.167.572-.02.787-.19.005.256.042.545.229.736.185.19.457.217.794.128a.752.752 0 00-.02.2.582.582 0 00.188.41c.199.185.519.254.848.238.182.186.453.167.693.18-.193.33-.44 1.218 0 1.482.362.217.81-.04 1.197.035h.001z" />
    <path
      fillRule="evenodd"
      d="M15.82 21.898c-.33 1.06.4 1.25 1.28 1.06.53.85 2.17.95 2.55-.1.624.445 1.233.17 1.847-.106.487-.22.978-.441 1.483-.304.153.012.291.16.435.314.194.207.396.423.655.326.445-.168.186-.805.036-1.177l-.006-.013h4.45a3.5 3.5 0 001.25 1.04v6.128H10.26v-5.889a2.88 2.88 0 001.07-1.28h4.49v.001zm10.46 2.909c0-.54.3-.97.5-1.11v.01a1.5 1.5 0 01.49 1.1c1.16-.48.8 1.36.26 1.02.13-.78-.7-.18-.55.82.273.045.243.072.17.136-.103.091-.293.259.17.663-.156.015-.23.007-.275.002-.021-.003-.036-.004-.051-.003-.038.004-.074.03-.2.118l-.034.023c-.134-.146-.19-.143-.291-.136-.058.003-.13.008-.239-.014.415-.308.292-.521.219-.65-.044-.075-.07-.121.041-.14.139-.008.135-.107.131-.192l-.001-.038c0-.77-.75-1.36-.6-.6-.59.32-.84-1.489.26-1.01v.001zm-13.48.19c.02-.55.3-.97.5-1.1v-.01a1.498 1.498 0 01.5 1.12c1.15-.48.79 1.34.25 1 .14-.78-.7-.18-.55.82.275.05.243.078.168.145-.103.092-.288.258.172.654-.09.01-.18.012-.27.004-.021-.001-.036-.003-.05 0-.033.004-.063.024-.162.09l-.068.046c-.136-.142-.192-.138-.296-.131a.89.89 0 01-.234-.009c.416-.315.292-.527.218-.653-.043-.074-.07-.118.042-.137.15-.01.13-.14.13-.24 0-.77-.75-1.35-.6-.6-.59.32-.84-1.479.25-1v.001zm8.595 1.608c-.02.134-.04.265-.065.381-1.19.18.07.6.55.35.25-1.2.69-1.14 1.63-.57-.27.1-.52.2-.64.47.84.2 1.83-.86.73-1.01-.2-.19-.3-.35-.43-.63a2.568 2.568 0 00-.178-.344c-.03-.048-.043-.072-.039-.09.004-.017.024-.03.063-.056.04-.027.1-.067.184-.14.82-.819-.6-1.139-1.25-.759l-.036.015-.104.043c-.533.225-1.777.75-1.46-.138.15-1.6-1.72 2.1 1.24.4 1.72-.86 1.98.3.68.44-.368 0-.753.09-1.123.177-.918.215-1.75.41-2.027-.837.22-.36-2.05-.42-1.53.4.7-.02-.44.32-.59-.2.03.571.437.483.803.404l.017-.004c-.05.1-.1.15-.2.05-.018.369.125.312.351.223l.059-.023c.223.601-.373.421-.926.254-.44-.133-.853-.258-.804.026 2.267 1.27 1.746 1.326 1.062 1.398-.381.04-.813.086-.842.351 2.34.33 3.04.23 4.98-1.14-.045.185-.08.372-.105.56v-.001z"
    />
    <path d="M21.42 20.092c-.46-.274-.35-.752-.37-1.192-.84.49-1.92.59-2.8.15-.29.401-.148.808-.328 1.248.188.09.344.233.45.41.45-.596 3.498-.342 3.048-.616zM10.635 38c-.372-.243-.774.346-.402.61l1.346.977c.372.244.774-.335.402-.61L10.635 38zm19.125.596c.391-.275-.04-.856-.41-.581l-1.325.959c-.391.275.04.877.411.601l1.324-.979zM21.005 9.451c.537-1.19-.437-2.881-1.787-2.35-.239.32-.686.15-.964.41-.517.42-.03.91.546.75-.218.23-.705 0-.963.06-.259.05-.318-.15-.457-.29-.209.02-.08.26.07.38.158.13.377.08.556.08.447-.11.228.5.625.45 1.987-.25-.298.51-.198 2.031-.07.56-.07 1.141-.14 1.691-.397.25-1.5.28-.476.81 1.023.541 1.47-1 3.546.27.318-.12.705-.58.298-.78-.983-.81-1.033-2.34-.656-3.512zm39.288 11.434c-1.064-.722-3.249-1.672-5.833-1.672-2.337 0-5.13.931-5.13 3.933 0 3.154 3.192 3.458 5.909 3.629 1.862.152 3.135.418 3.135 1.615 0 1.159-1.254 1.767-2.831 1.767-2.508 0-4.275-1.254-5.32-2.09l-1.539 1.862c1.444 1.178 3.61 2.451 6.821 2.451 3.04 0 5.586-1.197 5.586-4.256 0-3.42-3.534-3.686-5.795-3.838-1.615-.133-3.249-.209-3.249-1.311 0-1.064 1.102-1.52 2.337-1.52 2.052 0 3.61.779 4.351 1.33l1.558-1.9zm11.903-1.292v7.942c0 3.354-5.852 3.345-5.852 0v-7.942h-2.736v7.942c0 6.466 11.323 6.475 11.323 0v-7.942h-2.735zM84.457 32c2.337 0 3.686-.627 4.75-1.634 2.353-2.314 2.407-6.633.114-9.006-1.102-1.121-2.584-1.767-4.864-1.767h-5.833V32h5.833zm-3.116-2.337v-7.714h3.021c1.463 0 2.128.361 2.755.988 1.48 1.521 1.387 4.351-.095 5.833-.646.57-1.235.893-2.66.893h-3.021zM101.589 32c1.691 0 2.622-.399 3.382-1.121 1.792-1.748 1.459-4.875-1.064-5.738 1.636-.852 2.065-3.015.779-4.351-.684-.722-1.786-1.197-3.325-1.197h-7.43V32h7.658zm-.095-5.377c.589 0 1.026.19 1.368.532.266.285.437.646.437 1.045 0 .399-.171.798-.437 1.083-.323.304-.798.475-1.368.475h-4.826v-3.135h4.826zm-.456-4.769c.608 0 .969.133 1.235.418.228.228.38.532.38.893 0 .38-.152.741-.418 1.007-.285.285-.684.399-1.197.399h-4.37v-2.717h4.37zm16.561-2.261v7.942c0 3.354-5.852 3.345-5.852 0v-7.942h-2.736v7.942c0 6.466 11.324 6.475 11.324 0v-7.942h-2.736zM126.744 32v-4.56h3.686l2.508 4.56h3.116l-2.907-4.997c2.417-1.057 3.378-4.054 1.482-6.061-.798-.836-1.957-1.349-3.724-1.349h-6.878V32h2.717zM131 21.892c.97 0 1.919.547 1.919 1.615 0 .95-.779 1.634-1.729 1.634h-4.446v-3.249H131zm15.191-2.299l-3.002 4.313-3.021-4.313h-3.382l4.94 6.745V32h2.736v-5.662l4.921-6.745h-3.192zM158.399 32v-4.56h3.686l2.508 4.56h3.116l-2.907-4.997c1.52-.665 2.508-1.9 2.508-3.496 0-.988-.38-1.881-1.026-2.565-.798-.836-1.957-1.349-3.724-1.349h-6.878V32h2.717zm4.256-10.108c.97 0 1.919.547 1.919 1.615 0 .95-.779 1.634-1.729 1.634h-4.446v-3.249h4.256zm6.788 3.876c0 3.686 3.078 6.612 7.011 6.612 3.933 0 7.087-2.926 7.087-6.612 0-3.61-3.154-6.555-7.087-6.555s-7.011 2.945-7.011 6.555zm2.85 0c0-2.299 1.824-4.199 4.161-4.199 2.375 0 4.237 1.9 4.237 4.199 0 2.337-1.862 4.275-4.237 4.275-2.337 0-4.161-1.938-4.161-4.275zm12.524-6.175L188.788 32h2.584l2.318-7.372h.114L196.141 32h2.584l3.971-12.407h-2.85l-2.394 8.151h-.114l-2.527-8.151h-1.995l-2.546 8.151h-.114l-2.375-8.151h-2.964zM207.921 32V19.593h-2.717V32h2.717zm12.59-12.407v7.695h-.019l-6.327-7.695h-2.337V32h2.736v-7.676h.019L220.891 32h2.356V19.593h-2.736zm18.309 1.843c-1.786-1.444-3.933-2.223-5.89-2.223-3.838 0-6.84 2.945-6.84 6.574 0 3.648 2.964 6.574 6.935 6.574 1.938 0 4.199-.741 5.814-1.938v-5.567h-6.289v2.242h3.743v2.09c-.779.532-2.033.836-3.154.836-2.774 0-4.218-2.052-4.218-4.218 0-2.318 1.653-4.237 4.028-4.237 1.292 0 2.983.57 4.066 1.558l1.805-1.691zm18.191 6.631c-1.083 1.083-2.66 1.976-4.351 1.976-2.565 0-4.218-1.9-4.218-4.237 0-2.318 1.615-4.237 4.123-4.237 1.33 0 2.926.608 4.066 1.596l1.71-1.786c-1.482-1.273-3.724-2.166-6.004-2.166-4.009 0-6.745 3.002-6.745 6.574 0 3.648 2.717 6.593 6.84 6.593 2.717 0 4.883-1.216 6.308-2.546l-1.729-1.767zm4.173-8.474V32h10.013v-2.337h-7.296v-10.07h-2.717zm20.569 0v7.942c0 3.354-5.852 3.345-5.852 0v-7.942h-2.736v7.942c0 6.466 11.324 6.475 11.324 0v-7.942h-2.736zM295.838 32c1.691 0 2.622-.399 3.382-1.121.779-.76 1.159-1.672 1.159-2.66 0-1.444-.779-2.584-2.223-3.078.912-.475 1.558-1.425 1.558-2.489 0-.703-.285-1.349-.779-1.862-.684-.722-1.786-1.197-3.325-1.197h-7.429V32h7.657zm-.095-5.377c.589 0 1.026.19 1.368.532.266.285.437.646.437 1.045 0 .399-.171.798-.437 1.083-.323.304-.798.475-1.368.475h-4.826v-3.135h4.826zm-.456-4.769c.608 0 .969.133 1.235.418.228.228.38.532.38.893 0 .38-.152.741-.418 1.007-.285.285-.684.399-1.197.399h-4.37v-2.717h4.37z" />
  </svg>
);
