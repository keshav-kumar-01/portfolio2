import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@consts";

type Context = {
  site: string;
};

type Item = {
  data: {
    title: string;
    summary: string;
    date: string;
  };
  slug: string;
};

export async function GET(context: Context) {
  try {
    const posts: Item[] = await getCollection("blog");
    const projects: Item[] = await getCollection("projects");

    const items = [...posts, ...projects];

    items.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

    return rss({
      title: SITE.TITLE,
      description: SITE.DESCRIPTION,
      site: context.site,
      items: items.map((item) => ({
        title: item.data.title,
        description: item.data.summary,
        pubDate: new Date(item.data.date).toUTCString(),
        link: item.slug.startsWith("blog")
          ? `/blog/${item.slug}/`
          : `/projects/${item.slug}/`,
      })),
    });
  } catch (error) {
    console.error("Failed to generate RSS feed:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
