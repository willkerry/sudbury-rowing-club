import { z } from "zod";
import { useZodSWR } from "@/lib/zod-swr";

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
  likesCount: z.number(),
  ownerProfilePicUrl: z.string(),
  ownerUsername: z.string(),
  text: z.string(),
  timestamp: z.coerce.date(),
});

const MusicInfoSchema = z.object({
  artist_name: z.string(),
  audio_id: z.string(),
  should_mute_audio: z.boolean(),
  should_mute_audio_reason: z.string(),
  song_name: z.string(),
  uses_original_audio: z.boolean(),
});

const ChildPostSchema = z.object({
  alt: z.union([z.null(), z.string()]),
  caption: z.string(),
  childPosts: z.array(z.any()),
  commentsCount: z.number(),
  dimensionsHeight: z.number(),
  dimensionsWidth: z.number(),
  displayUrl: z.string(),
  firstComment: z.string(),
  hashtags: z.array(z.any()),
  id: z.string(),
  images: z.array(z.any()),
  latestComments: z.array(z.any()),
  likesCount: z.null(),
  mentions: z.array(z.any()),
  ownerId: z.null(),
  shortCode: z.string(),
  taggedUsers: z.array(TaggedUserSchema).optional(),
  timestamp: z.null(),
  type: InstagramPostTypeSchema,
  url: z.string(),
  videoPlayCount: z.null().optional(),
  videoUrl: z.string().optional(),
  videoViewCount: z.number().optional(),
});

export const InstagramPostSchema = z.object({
  alt: z.union([z.null(), z.string()]),
  caption: z.string(),
  childPosts: z.array(ChildPostSchema),
  commentsCount: z.number(),
  dimensionsHeight: z.number(),
  dimensionsWidth: z.number(),
  displayUrl: z.string(),
  firstComment: z.string(),
  hashtags: z.array(z.string()),
  id: z.string(),
  images: z.array(z.string()),
  inputUrl: z.string(),
  isSponsored: z.boolean(),
  latestComments: z.array(LatestCommentSchema),
  likesCount: z.number(),
  locationId: z.string().optional(),
  locationName: z.string().optional(),
  mentions: z.array(z.any()),
  musicInfo: MusicInfoSchema.optional(),
  ownerFullName: z.string(),
  ownerId: z.string(),
  ownerUsername: z.string(),
  productType: z.string().optional(),
  shortCode: z.string(),
  taggedUsers: z.array(TaggedUserSchema).optional(),
  timestamp: z.coerce.date(),
  type: InstagramPostTypeSchema,
  url: z.string(),
  videoDuration: z.number().optional(),
  videoPlayCount: z.number().optional(),
  videoUrl: z.string().optional(),
  videoViewCount: z.number().optional(),
});

export const useInstagramPosts = () =>
  useZodSWR(z.array(InstagramPostSchema), [KEY], async () =>
    (await fetch(QUERY_URL)).json(),
  );

export type InstagramPost = z.infer<typeof InstagramPostSchema>;
