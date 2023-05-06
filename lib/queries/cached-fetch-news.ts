import fs from "fs";
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

export default writeToTempFile;

const readFromTempFile = async () => {
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

const getArticleBySlug = async (slug: string) => {
  const articles = await readFromTempFile();

  return articles[prependNewsPrefix(slug)];
};

const getArticleCount = async () => {
  const articles = await readFromTempFile();

  return Object.keys(articles).length;
};

const getAllSlugs = async () => {
  const articles = await readFromTempFile();

  return Object.keys(articles).map(removeNewsPrefix);
};

const getNArticles = async (first: number, last: number) => {
  const articles = await readFromTempFile();

  return z
    .array(ZArticleSummary)
    .parse(Object.values(articles).slice(first, last));
};

export { getArticleBySlug, getArticleCount, getAllSlugs, getNArticles };
