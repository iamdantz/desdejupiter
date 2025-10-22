// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import robots from "astro-robots";

import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://desdejupiter.me",
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap(),
    robots({
      host: "desdejupiter.me",
      sitemap: [
        "https://desdejupiter.me/sitemap-index.xml",
        "https://www.desdejupiter.me/sitemap-index.xml",
      ],
      policy: [
        {
          userAgent: [
            "Googlebot",
            "bingbot",
            "Applebot",
            "Yandex",
            "DuckDuckBot",
          ],
          allow: ["/"],
          crawlDelay: 0,
        },
        {
          userAgent: "AhrefsBot",
          disallow: ["/"],
        },
      ],
    }),
  ],
});