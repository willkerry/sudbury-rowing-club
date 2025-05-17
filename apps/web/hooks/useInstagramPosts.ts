import useZodSWR from "@/lib/zod-swr";
import { z } from "zod";

const KEY = "instagram-posts";
const QUERY_URL = "https://api.apify.com/v2/datasets/uAnWYUNLDbdXEpikD/items";

const InstagramPostTypeSchema = z.enum(["Image", "Video", "Sidecar"]);

const TaggedUserSchema = z.object({
  full_name: z.string(),
  id: z.string(),
  is_verified: z.boolean(),
  profile_pic_url: z.string(),
  username: z.string(),
});

const LatestCommentSchema = z.object({
  id: z.string(),
  text: z.string(),
  ownerUsername: z.string(),
  ownerProfilePicUrl: z.string(),
  timestamp: z.coerce.date(),
  likesCount: z.number(),
});

const MusicInfoSchema = z.object({
  artist_name: z.string(),
  song_name: z.string(),
  uses_original_audio: z.boolean(),
  should_mute_audio: z.boolean(),
  should_mute_audio_reason: z.string(),
  audio_id: z.string(),
});

const ChildPostSchema = z.object({
  id: z.string(),
  type: InstagramPostTypeSchema,
  shortCode: z.string(),
  caption: z.string(),
  hashtags: z.array(z.any()),
  mentions: z.array(z.any()),
  url: z.string(),
  commentsCount: z.number(),
  firstComment: z.string(),
  latestComments: z.array(z.any()),
  dimensionsHeight: z.number(),
  dimensionsWidth: z.number(),
  displayUrl: z.string(),
  images: z.array(z.any()),
  alt: z.union([z.null(), z.string()]),
  likesCount: z.null(),
  timestamp: z.null(),
  childPosts: z.array(z.any()),
  ownerId: z.null(),
  taggedUsers: z.array(TaggedUserSchema).optional(),
  videoUrl: z.string().optional(),
  videoViewCount: z.number().optional(),
  videoPlayCount: z.null().optional(),
});

export const InstagramPostSchema = z.object({
  inputUrl: z.string(),
  id: z.string(),
  type: InstagramPostTypeSchema,
  shortCode: z.string(),
  caption: z.string(),
  hashtags: z.array(z.string()),
  mentions: z.array(z.any()),
  url: z.string(),
  commentsCount: z.number(),
  firstComment: z.string(),
  latestComments: z.array(LatestCommentSchema),
  dimensionsHeight: z.number(),
  dimensionsWidth: z.number(),
  displayUrl: z.string(),
  images: z.array(z.string()),
  alt: z.union([z.null(), z.string()]),
  likesCount: z.number(),
  timestamp: z.coerce.date(),
  childPosts: z.array(ChildPostSchema),
  locationName: z.string().optional(),
  locationId: z.string().optional(),
  ownerFullName: z.string(),
  ownerUsername: z.string(),
  ownerId: z.string(),
  isSponsored: z.boolean(),
  videoUrl: z.string().optional(),
  videoViewCount: z.number().optional(),
  videoPlayCount: z.number().optional(),
  productType: z.string().optional(),
  videoDuration: z.number().optional(),
  musicInfo: MusicInfoSchema.optional(),
  taggedUsers: z.array(TaggedUserSchema).optional(),
});

const useInstagramPosts = () =>
  useZodSWR(z.array(InstagramPostSchema), [KEY], async () =>
    (await fetch(QUERY_URL)).json(),
  );

export type InstagramPost = z.infer<typeof InstagramPostSchema>;

export default useInstagramPosts;
