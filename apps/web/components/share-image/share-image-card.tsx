import { Wordmark } from "@sudburyrc/blue";
import {
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_WIDTH,
  type ShareImage,
} from "@/lib/share-image";
import { variants } from "./variants";

const EMOJI = /(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*)/u;

// The title's gradient comes from `background-clip: text` with transparent
// text, which would paint emoji as flat gradient shapes. Opaque spans keep
// their colours.
const withColourEmoji = (text: string) =>
  text.split(EMOJI).map((part, index) =>
    index % 2 === 1 ? (
      <span className="text-black" key={index}>
        {part}
      </span>
    ) : (
      part
    ),
  );

/**
 * The share image design, at its full 1200×600 size. The OG Worker screenshots
 * it from /og-template, and the share playground shows it scaled down.
 */
export const ShareImageCard = ({ title, subtitle, variant }: ShareImage) => {
  const { bg, mg, fg, g1, g2, weight, spacing } = variants[variant];

  return (
    <div
      className="flex overflow-hidden p-[100px] font-sans"
      style={{
        backgroundColor: bg,
        color: fg,
        height: SHARE_IMAGE_HEIGHT,
        width: SHARE_IMAGE_WIDTH,
      }}
    >
      <div className="flex w-full flex-col self-center">
        <div className="flex items-center">
          <Wordmark
            className="shrink-0"
            style={{ height: (400 * 50) / 302, width: 400 }}
            suppressTitle
          />

          {subtitle && (
            <div
              className="mt-[3.7px] ml-8 uppercase text-[23px] tracking-[2px]"
              style={{ color: mg }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div
          className="my-2.5 bg-clip-text text-[72px] leading-tight text-transparent"
          style={{
            backgroundImage: `linear-gradient(90deg, ${g1} 0%, ${g2} 100%)`,
            fontWeight: weight,
            letterSpacing: spacing,
          }}
        >
          {withColourEmoji(title)}
        </div>
      </div>
    </div>
  );
};
