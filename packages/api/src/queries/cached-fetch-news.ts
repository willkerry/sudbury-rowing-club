import { z } from "zod";
import { Cache } from "../shared/cache";
import {
  type Article,
  type ArticleSummary,
  fetchAllArticles,
  ZArticleSummary,
} from "./fetch-news-article";

const cache = new Cache({
  key: "news",
  ttl: 60 * 5,
  function: fetchAllArticles,
  primaryKey: "slug",
});

const serverGetArticleBySlug = (slug: string): Promise<Article | undefined> =>
  cache.getByPrimaryKey(slug);

const serverGetArticleCount = async (): Promise<number> => {
  const articles = await cache.get();

  return Object.keys(articles).length;
};

const serverGetAllSlugs = async (): Promise<string[]> => {
  const articles = await cache.get();

  return Object.keys(articles);
};

const serverGetNArticles = async (
  first: number,
  last: number,
): Promise<ArticleSummary[]> => {
  const articles = await cache.get();

  return z
    .array(ZArticleSummary)
    .parse(Object.values(articles).slice(first, last));
};

export {
  serverGetArticleBySlug,
  serverGetArticleCount,
  serverGetAllSlugs,
  serverGetNArticles,
};
