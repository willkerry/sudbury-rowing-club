import { PortableTextProps } from "@portabletext/react";

type Post = {
    _id: string;
    title: string,
    date: string,
    slug: string,
    excerpt: string,
    body: PortableTextProps["value"][],
    author: {
        firstName: string,
        surname: string,
    },
    featuredImage: {
        _id: string,
        alt: string,
        caption: string,
        aspectRatio: number,
        lqip: string,
        background: string,
        foreground: string,
    }
}

export default Post;