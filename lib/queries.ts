import groq from "groq";

export const postFields = groq`
    _id,
    "slug": slug.current,
    title,
    excerpt,
    date,
    author {"firstName": @->firstName, "surname": @->surname, "_id": @->_id},
    body[]{
        ...,
        _type == "figure" => {
            "_id": @.image.asset->_id,
            "altText": @.image.asset->altText,
            "description": @.image.asset->description,   
            "lqip": @.image.asset->metadata.lqip,
            "aspectRatio": @.image.asset->metadata.dimensions.aspectRatio,
        },
    },
    featuredImage {
        alt, 
        caption,
        "url": @.image.asset->url,
        "_id": @.image.asset->_id, 
        "lqip": @.image.asset->metadata.lqip, 
        "aspectRatio": @.image.asset->metadata.dimensions.aspectRatio,
        "background": @.image.asset->metadata.palette.muted.background,
        "foreground": @.image.asset->metadata.palette.muted.foreground
    }
`;

export const indexQuery = groq`
*[_type == "post"] | order(date desc, _updatedAt desc) {
  ${postFields}
}`;

export const postQuery = groq`
*[_type == "news" && slug.current == $slug][0] {
    ${postFields}
}`;

export const postSlugsQuery = groq`
*[_type == "news" && defined(slug.current)][].slug.current
`;

export const postBySlugQuery = groq`
*[_type == "post" && slug.current == $slug][0] {
  ${postFields}
}`;
