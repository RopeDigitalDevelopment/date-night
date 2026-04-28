export interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export async function searchYouTubeVideos(
  query: string,
  apiKey: string,
  maxResults = 4
): Promise<YouTubeVideo[]> {
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: String(maxResults),
    relevanceLanguage: 'en',
    videoEmbeddable: 'true',
    key: apiKey,
  });

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params}`
  );

  if (!res.ok) return [];

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.items ?? []).map((item: any) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails?.medium?.url ?? '',
    channelTitle: item.snippet.channelTitle,
  }));
}
