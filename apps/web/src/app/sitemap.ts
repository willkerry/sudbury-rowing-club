import {
  fetchAllAuthors,
  fetchArchives,
  fetchNoticeSlugs,
  fetchSafety,
  serverGetAllSlugs,
} from "@sudburyrc/api";
import { allPolicies } from "content-collections";
import { slug } from "github-slugger";
import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/constants";
import { getCommitteeArchive } from "@/lib/get-committee-archive";
import {
  getSlugifiedRecords,
  slugify,
} from "./regatta/records/transformRecords";

const url = (pathname: string) => `${BASE_URL}${pathname}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const archives = await fetchArchives();
  const notices = await fetchNoticeSlugs();
  const authors = await fetchAllAuthors();
  const news = await serverGetAllSlugs();
  const safetyItems = await fetchSafety();
  const committeeArchive = getCommitteeArchive();
  const records = getSlugifiedRecords();

  const archiveDynamicPaths: MetadataRoute.Sitemap = archives.map(
    (archive) => ({
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.5,
      url: url(`/150/gallery/${archive._id}`),
    }),
  );

  const noticeDynamicPaths: MetadataRoute.Sitemap = notices.map((notice) => ({
    changeFrequency: "monthly",
    lastModified: new Date(),
    priority: 0.5,
    url: url(`/members/${notice.slug}`),
  }));

  const authorDynamicPaths: MetadataRoute.Sitemap = authors.map(({ _id }) => ({
    changeFrequency: "yearly",
    lastModified: new Date(),
    priority: 0.5,
    url: url(`/news/author/${_id}`),
  }));

  const newsDynamicPaths: MetadataRoute.Sitemap = news.map((slug) => ({
    changeFrequency: "daily",
    lastModified: new Date(),
    priority: 0.5,
    url: url(`/news/${slug}`),
  }));

  const safetyDynamicPaths: MetadataRoute.Sitemap = safetyItems.map((item) => ({
    changeFrequency: "daily",
    lastModified: new Date(item._updatedAt),
    priority: 0.5,
    url: url(`/safety/${item._id}`),
  }));

  const policiesDynamicPaths: MetadataRoute.Sitemap = allPolicies.map(
    (policy) => ({
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.5,
      url: url(`/governance/${policy._meta.path}`),
    }),
  );

  const committeeArchiveDynamicPaths: MetadataRoute.Sitemap =
    committeeArchive.map(({ season }) => ({
      changeFrequency: "never",
      lastModified: new Date(season.split(" ")[0]),
      priority: 0.1,
      url: url(`/about/history/committees/${slug(season)}`),
    }));

  const recordsDynamicPaths: MetadataRoute.Sitemap = records.map((record) => ({
    changeFrequency: "monthly",
    lastModified: new Date(record.year),
    priority: 0.5,
    url: url(`/regatta/records/${slugify(record.event)}`),
  }));

  return [
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 1,
      url: url("/"),
    },
    {
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/about/history"),
    },
    {
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.25,
      url: url("/about/history/committees"),
    },
    ...committeeArchiveDynamicPaths,
    {
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.25,
      url: url("/about/brand"),
    },
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 0.8,
      url: url("/safety"),
    },
    ...safetyDynamicPaths,
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.9,
      url: url("/governance"),
    },
    ...policiesDynamicPaths,
    {
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/about/sponsorship"),
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/150"),
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/150/gallery"),
    },
    ...archiveDynamicPaths,
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/contact/how-to-find-us"),
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/contact"),
    },
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/news"),
    },
    ...newsDynamicPaths,
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/news/author"),
    },
    ...authorDynamicPaths,
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 0.9,
      url: url("/regatta"),
    },
    {
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.9,
      url: url("/regatta/draw"),
    },
    {
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.9,
      url: url("/regatta/results"),
    },
    {
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.9,
      url: url("/regatta/entries"),
    },
    {
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/regatta/course"),
    },
    {
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/regatta/galleries"),
    },
    {
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/regatta/competitor-information"),
    },
    {
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.9,
      url: url("/join"),
    },
    {
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.6,
      url: url("/join/apply"),
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/members"),
    },
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/members/events"),
    },
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/members/membership-rates"),
    },
    ...noticeDynamicPaths,
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/regatta/records"),
    },
    ...recordsDynamicPaths,
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/stourtoys"),
    },
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/stourtoys/club-lookup"),
    },
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 0.5,
      url: url("/stourtoys/search"),
    },
    {
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.1,
      url: url("/bugs"),
    },
  ];
}
