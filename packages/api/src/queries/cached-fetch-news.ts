import { z } from "zod";
import { isDraftMode } from "../sanity/client";
import { Cache } from "../shared/cache";
import {
  type Article,
  type ArticleSummary,
  fetchAllArticles,
  ZArticleSummary,
} from "./fetch-news-article";

const cache = new Cache({
  function: fetchAllArticles,
  key: "news",
  primaryKey: "slug",
  ttl: 60 * 5,
});

// The cache is shared by every request in the isolate, so drafts bypass it.
const getArticles = async (): Promise<Article[]> =>
  (await isDraftMode()) ? fetchAllArticles() : cache.get();

const serverGetArticleBySlug = async (
  slug: string,
): Promise<Article | undefined> =>
  (await isDraftMode())
    ? (await fetchAllArticles()).find((article) => article.slug === slug)
    : cache.getByPrimaryKey(slug);

const serverGetArticleCount = async (): Promise<number> =>
  (await getArticles()).length;

const serverGetAllSlugs = async (): Promise<string[]> =>
  (await getArticles()).map((article) => article.slug);

const serverGetNArticles = async (
  first: number,
  last: number,
): Promise<ArticleSummary[]> =>
  z.array(ZArticleSummary).parse((await getArticles()).slice(first, last));

export {
  serverGetAllSlugs,
  serverGetArticleBySlug,
  serverGetArticleCount,
  serverGetNArticles,
};
