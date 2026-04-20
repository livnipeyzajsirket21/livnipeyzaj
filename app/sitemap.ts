import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://livnipeyzaj.com";
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/calismalarimiz`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
