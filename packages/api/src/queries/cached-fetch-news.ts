import * as fs from "fs";
import { z } from "zod";
import {
  fetchAllArticles,
  type Article,
  ZArticleSummary,
} from "./fetch-news-article";

const TEMP_DIR = "./.tmp";

const prependNewsPrefix = (slug: string) => `news-${slug}`;
const removeNewsPrefix = (slug: string) => slug.replace(/^news-/, "");

const writeToTempFile = async () => {
  if (typeof window !== "undefined") {
    return;
  }

  const articles = await fetchAllArticles();

  const dateSortedArticles = articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const articlesBySlug = dateSortedArticles.reduce((acc, article) => {
    acc[prependNewsPrefix(article.slug)] = article;
    return acc;
  }, {} as Record<string, Article>);

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
  }

  fs.writeFileSync(`${TEMP_DIR}/articles.json`, JSON.stringify(articlesBySlug));
  fs.writeFileSync(`${TEMP_DIR}/fetchTime.txt`, new Date().toISOString());
};

const readFromTempFile = async () => {
  if (typeof window !== "undefined") {
    return {};
  }

  // Does the file exist?
  if (!fs.existsSync(`${TEMP_DIR}/articles.json`)) {
    await writeToTempFile();
  }

  if (fs.existsSync(`${TEMP_DIR}/fetchTime.txt`)) {
    const fetchTimeContents = fs.readFileSync(
      `${TEMP_DIR}/fetchTime.txt`,
      "utf-8"
    );
    const fetchTime = new Date(fetchTimeContents);
    const now = new Date();
    const diff = now.getTime() - fetchTime.getTime();

    const fifteenMinutes = 1000 * 60 * 15;

    if (diff > fifteenMinutes) {
      await writeToTempFile();
    }
  }

  const articles = await fs.readFileSync(`${TEMP_DIR}/articles.json`, "utf-8");

  return JSON.parse(articles) as Record<string, Article>;
};

const serverGetArticleBySlug = async (slug: string) => {
  const articles = await readFromTempFile();

  return articles[prependNewsPrefix(slug)];
};

const serverGetArticleCount = async () => {
  const articles = await readFromTempFile();

  return Object.keys(articles).length;
};

const serverGetAllSlugs = async () => {
  const articles = await readFromTempFile();

  return Object.keys(articles).map(removeNewsPrefix);
};

const serverGetNArticles = async (first: number, last: number) => {
  const articles = await readFromTempFile();

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
