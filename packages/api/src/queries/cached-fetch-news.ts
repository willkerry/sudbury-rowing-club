import { z } from "zod";
import {
  type Article,
  ZArticleSummary,
  fetchAllArticles,
} from "./fetch-news-article";

type Cache = {
  articles: { [slug: string]: Article };
  lastFetchTime: number;
};

const cache: Cache = {
  articles: {},
  lastFetchTime: 0,
};
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

const prependNewsPrefix = (slug: string) => `news-${slug}`;
const removeNewsPrefix = (slug: string) => slug.replace(/^news-/, "");

const writeToCache = async () => {
  const articles = await fetchAllArticles();

  const dateSortedArticles = articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const articlesBySlug = dateSortedArticles.reduce(
    (acc, article) => {
      acc[prependNewsPrefix(article.slug)] = article;
      return acc;
    },
    {} as Record<string, Article>,
  );

  cache.articles = articlesBySlug;
  cache.lastFetchTime = new Date().getTime();
};

const readFromCache = async () => {
  const { lastFetchTime } = cache;
  const now = Date.now();

  if (
    !lastFetchTime ||
    now - lastFetchTime > CACHE_DURATION ||
    process.env.NODE_ENV === "development"
  ) {
    await writeToCache();
  }

  return cache.articles;
};

const serverGetArticleBySlug = async (slug: string) => {
  const articles = await readFromCache();

  const key = prependNewsPrefix(slug);

  if (key in articles) {
    return articles[key];
  }

  return null;
};

const serverGetArticleCount = async () => {
  const articles = await readFromCache();

  return Object.keys(articles).length;
};

const serverGetAllSlugs = async () => {
  const articles = await readFromCache();

  return Object.keys(articles).map(removeNewsPrefix);
};

const serverGetNArticles = async (first: number, last: number) => {
  const articles = await readFromCache();

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
