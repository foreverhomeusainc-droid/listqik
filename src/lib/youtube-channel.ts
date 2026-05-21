export type YouTubeChannelVideo = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  watchUrl: string;
};

export type YouTubeChannelFeed = {
  channelId: string;
  channelTitle: string;
  channelUrl: string;
  videos: YouTubeChannelVideo[];
  source: "api" | "rss";
};

const DEFAULT_CHANNEL_ID = "UCijYyspf6u9RSR2vg82A__A";
const DEFAULT_HANDLE = "ListQuick";
const DEFAULT_CHANNEL_URL = "https://www.youtube.com/@ListQuick";

function channelUrlFromEnv(): string {
  return (
    process.env.YOUTUBE_CHANNEL_URL ??
    (process.env.YOUTUBE_CHANNEL_HANDLE
      ? `https://www.youtube.com/@${process.env.YOUTUBE_CHANNEL_HANDLE.replace(/^@/, "")}`
      : DEFAULT_CHANNEL_URL)
  );
}

function maxVideos(): number {
  const n = Number(process.env.YOUTUBE_MAX_VIDEOS ?? "12");
  return Number.isFinite(n) && n > 0 ? Math.min(n, 50) : 12;
}

function decodeXml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function parseRssFeed(xml: string, channelId: string, channelUrl: string): YouTubeChannelFeed {
  const channelTitle =
    decodeXml(xml.match(/<feed[^>]*>[\s\S]*?<title>([^<]*)<\/title>/)?.[1] ?? "List Quick");

  const entries = xml.split("<entry>").slice(1);
  const videos: YouTubeChannelVideo[] = [];

  for (const entry of entries) {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    if (!id) continue;

    const title = decodeXml(entry.match(/<title>([^<]*)<\/title>/)?.[1] ?? "Video");
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
    const description = decodeXml(
      entry.match(/<media:description>([^<]*)<\/media:description>/)?.[1] ?? "",
    );
    const thumbnailUrl =
      entry.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] ??
      `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    videos.push({
      id,
      title,
      description,
      publishedAt,
      thumbnailUrl,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
    });
    if (videos.length >= maxVideos()) break;
  }

  return {
    channelId,
    channelTitle,
    channelUrl,
    videos,
    source: "rss",
  };
}

async function resolveChannelId(apiKey: string, handle: string): Promise<string | null> {
  const cleanHandle = handle.replace(/^@/, "");
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "contentDetails,snippet");
  url.searchParams.set("forHandle", cleanHandle);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    items?: Array<{
      id?: string;
      snippet?: { title?: string };
      contentDetails?: { relatedPlaylists?: { uploads?: string } };
    }>;
  };

  return data.items?.[0]?.id ?? null;
}

async function fetchViaApi(
  apiKey: string,
  channelId: string,
  channelUrl: string,
): Promise<YouTubeChannelFeed | null> {
  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`,
    { next: { revalidate: 3600 } },
  );
  if (!channelRes.ok) return null;

  const channelData = (await channelRes.json()) as {
    items?: Array<{
      snippet?: { title?: string };
      contentDetails?: { relatedPlaylists?: { uploads?: string } };
    }>;
  };

  const item = channelData.items?.[0];
  const uploadsPlaylistId = item?.contentDetails?.relatedPlaylists?.uploads;
  const channelTitle = item?.snippet?.title ?? "List Quick";
  if (!uploadsPlaylistId) return null;

  const playlistRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(uploadsPlaylistId)}&maxResults=${maxVideos()}&key=${encodeURIComponent(apiKey)}`,
    { next: { revalidate: 3600 } },
  );
  if (!playlistRes.ok) return null;

  const playlistData = (await playlistRes.json()) as {
    items?: Array<{
      snippet?: {
        title?: string;
        description?: string;
        publishedAt?: string;
        thumbnails?: { high?: { url?: string }; medium?: { url?: string }; default?: { url?: string } };
        resourceId?: { videoId?: string };
      };
    }>;
  };

  const videos: YouTubeChannelVideo[] = [];
  for (const row of playlistData.items ?? []) {
    const id = row.snippet?.resourceId?.videoId;
    if (!id) continue;
    const thumbs = row.snippet?.thumbnails;
    videos.push({
      id,
      title: row.snippet?.title ?? "Video",
      description: row.snippet?.description ?? "",
      publishedAt: row.snippet?.publishedAt ?? "",
      thumbnailUrl:
        thumbs?.high?.url ?? thumbs?.medium?.url ?? thumbs?.default?.url ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
    });
  }

  return {
    channelId,
    channelTitle,
    channelUrl,
    videos,
    source: "api",
  };
}

async function fetchViaRss(channelId: string, channelUrl: string): Promise<YouTubeChannelFeed> {
  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`,
    { next: { revalidate: 3600 } },
  );
  const xml = res.ok ? await res.text() : "";
  return parseRssFeed(xml, channelId, channelUrl);
}

/** Latest videos from the ListQik YouTube channel (RSS by default; API when keyed). */
export async function fetchListQikYouTubeFeed(): Promise<YouTubeChannelFeed> {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  const handle = process.env.YOUTUBE_CHANNEL_HANDLE?.trim() || DEFAULT_HANDLE;
  let channelId = process.env.YOUTUBE_CHANNEL_ID?.trim() || DEFAULT_CHANNEL_ID;
  const channelUrl = channelUrlFromEnv();

  if (apiKey) {
    if (!process.env.YOUTUBE_CHANNEL_ID?.trim()) {
      const resolved = await resolveChannelId(apiKey, handle);
      if (resolved) channelId = resolved;
    }
    const apiFeed = await fetchViaApi(apiKey, channelId, channelUrl);
    if (apiFeed) return apiFeed;
  }

  return fetchViaRss(channelId, channelUrl);
}
