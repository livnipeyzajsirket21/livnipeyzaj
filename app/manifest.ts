import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Livni Peyzaj",
    short_name: "Livni Peyzaj",
    description:
      "Ankara'da profesyonel peyzaj tasarımı, uygulama ve bakım hizmetleri.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#183325",
    icons: [
      {
        src: "/logo.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
      },
      {
        src: "/logo.jpeg",
        sizes: "192x192",
        type: "image/jpeg",
      },
    ],
  };
}
