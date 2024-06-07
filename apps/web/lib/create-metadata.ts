import { Metadata } from "next";
import { makeShareImageURL } from "./og-image";

type CreateMetadataOptions = {
  title: string;
  description?: string;
  author?: string;
  image?:
    | string
    | {
        color?: NonNullable<Parameters<typeof makeShareImageURL>[2]>["variant"];
        title?: string;
        subtitle?: string;
      };
  type?: "article" | "website";
  publishedTime?: string;
};

type CreateMetadata = (options: CreateMetadataOptions) => Metadata;

export const createMetaData: CreateMetadata = ({
  title,
  description,
  image,
  author,
  type,
  publishedTime,
}) => {
  const imageUrl =
    typeof image === "string"
      ? image
      : makeShareImageURL(image?.title ?? title, undefined, {
          subtitle: image?.subtitle ?? author ?? "",
          variant: image?.color,
        });

  makeShareImageURL(title, true, {
    subtitle: description,
  });

  return {
    title,
    description,
    ...(author && { authors: [{ name: author }] }),

    openGraph: {
      title,
      description,
      ...(author && { authors: [author] }),
      ...(type && { type }),
      ...(publishedTime && { publishedTime }),
      images: [
        {
          url: imageUrl,
        },
      ],
    },
    twitter: {
      title,
      ...(author && { creator: author }),
      description,
      images: [{ url: imageUrl }],
    },
  };
};
