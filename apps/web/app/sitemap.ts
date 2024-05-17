import type { MetadataRoute } from "next";
import {
  fetchAllAuthors,
  fetchArchives,
  fetchNoticeSlugs,
  fetchSafety,
  serverGetAllSlugs,
} from "@sudburyrc/api";
import { BASE_URL } from "@/lib/constants";

const url = (pathname: string) => `${BASE_URL}${pathname}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const archives = await fetchArchives();
  const notices = await fetchNoticeSlugs();
  const authors = await fetchAllAuthors();
  const news = await serverGetAllSlugs();
  const safetyItems = await fetchSafety();

  const archiveDynamicPaths: MetadataRoute.Sitemap = archives.map(
    (archive) => ({
      url: url(`/150/gallery/${archive._id}`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    }),
  );

  const noticeDynamicPaths: MetadataRoute.Sitemap = notices.map((notice) => ({
    url: url(`/members/${notice.slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const authorDynamicPaths: MetadataRoute.Sitemap = authors.map(({ _id }) => ({
    url: url(`/news/author/${_id}`),
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.5,
  }));

  const newsDynamicPaths: MetadataRoute.Sitemap = news.map((slug) => ({
    url: url(`/news/${slug}`),
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.5,
  }));

  const safetyDynamicPaths: MetadataRoute.Sitemap = safetyItems.map((item) => ({
    url: url(`/safety/${item._id}`),
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.5,
  }));

  return [
    {
      url: url("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: url("/about/history"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: url("/about/history/committees"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.25,
    },
    {
      url: url("/about/brand"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.25,
    },
    {
      url: url("/safety"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...safetyDynamicPaths,
    {
      url: url("/governance"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: url("/governance/anti-bullying-policy"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: url("/governance/club-rules"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: url("/governance/constitution"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: url("/governance/grievance-and-disciplinary-policy"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: url("/governance/privacy-policy"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: url("/about/sponsorship"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: url("/150"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: url("/150/gallery"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...archiveDynamicPaths,
    {
      url: url("/contact/how-to-find-us"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: url("/contact"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: url("/news"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    ...newsDynamicPaths,
    {
      url: url("/news/author"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    ...authorDynamicPaths,
    {
      url: url("/regatta"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: url("/regatta/results"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: url("/regatta/entries"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: url("/regatta/course"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: url("/regatta/galleries"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: url("/regatta/competitor-information"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: url("/join"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: url("/join/apply"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: url("/members"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: url("/members/events"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: url("/members/membership-rates"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    ...noticeDynamicPaths,
    {
      url: url("/stourtoys/club-lookup"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: url("/stourtoys/search"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: url("/bugs"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];
}
