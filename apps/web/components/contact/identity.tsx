import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { forwardRef } from "react";

const IdentityImage = forwardRef<
  React.ElementRef<typeof AvatarImage>,
  { id: string; lqip?: string }
>(({ id, lqip, ...props }, ref) => {
  const imageProps = useSanityImageProps(id, {
    imageBuilder: (builder) => builder.width(80).height(80).fit("crop"),
  });

  if (!imageProps?.src || !id) return null;

  return (
    <AvatarImage ref={ref} asChild src={imageProps.src} {...props}>
      <Image alt="" {...imageProps} placeholder="blur" blurDataURL={lqip} />
    </AvatarImage>
  );
});

IdentityImage.displayName = AvatarImage.displayName;

export const Identity = ({
  imageId,
  lqip,
  fallback,
  name,
  description,
  highlightDescription,
  className,
}: {
  imageId?: string;
  lqip?: string;
  fallback?: string;
  name?: string;
  description?: string;
  highlightDescription?: boolean;
  className?: string;
}) => (
  <div className={cn("flex w-full items-center gap-2", className)}>
    <Avatar>
      {imageId && <IdentityImage id={imageId} lqip={lqip} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
    <div>
      <p className="text-xs font-semibold leading-snug text-gray-800">{name}</p>
      <p
        className={cn(
          "text-xs font-medium leading-snug text-gray-500",
          highlightDescription &&
            "underline decoration-red-600 decoration-wavy",
        )}
      >
        {description}
      </p>
    </div>
  </div>
);
