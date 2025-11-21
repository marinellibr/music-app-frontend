import { User, Post } from "../models/user.model";
import { Media } from "../models/media.model";
import { UserMock } from "../mocks/user.mock";
import spotifyService from "./spotifyService";

const API_BASE_URL = process.env.REACT_APP_ENDPOINT_API || "";

export async function getUserById(id: string): Promise<User> {
  const urlUser = `${API_BASE_URL}/users/${id}`;

  try {
    console.log("Fetch URL:", urlUser);

    const res = await fetch(urlUser);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - Erro ao buscar usuário`);
    }

    const data: User = await res.json();
    console.log("User data:", data);
    return data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Fetch error:", message);

    const mock = UserMock;
    console.log("Using mock user data:", mock);
    return mock as User;
  }
}

export async function loadPostsWithMediaDetails(
  posts: Post[]
): Promise<Media[]> {
  const flatPosts = posts.flat();

  const results: Media[] = await Promise.all(
    flatPosts.map(async (post) => {
      if (!post.mediaType) return { ...post } as Media;

      let mediaData: any;

      if (post.mediaType === "track") {
        mediaData = await spotifyService.getTrackById(post.mediaId);
        return {
          ...post,
          mediaName: mediaData.name || "",
          mediaArtist:
            mediaData.artists?.map((a: any) => a.name).join(", ") || "",
          mediaCoverUrl: mediaData.album?.images[0]?.url || "",
          mediaYear: mediaData.album?.release_date?.split("-")[0] || "",
          mediaLink: mediaData.external_urls?.spotify || "",
        };
      } else if (post.mediaType === "album") {
        mediaData = await spotifyService.getAlbumById(post.mediaId);
        return {
          ...post,
          mediaName: mediaData.name || "",
          mediaArtist:
            mediaData.artists?.map((a: any) => a.name).join(", ") || "",
          mediaCoverUrl: mediaData.images[0]?.url || "",
          mediaYear: mediaData.release_date?.split("-")[0] || "",
          mediaLink: mediaData.external_urls?.spotify || "",
        };
      }

      return { ...post } as Media;
    })
  );

  return results;
}

export async function createUserPost(
  userId: string,
  postData: Omit<Post, "_id">
): Promise<{ message: string; postId: string; userId: string }> {
  const url = `${API_BASE_URL}/users/${userId}`;

  try {
    console.log("Creating post at:", url);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        `HTTP ${res.status} - ${errorData.error || "Erro ao criar post"}`
      );
    }

    const responseData = await res.json();
    console.log("Post created successfully:", responseData);

    return responseData;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Create Post error:", message);

    throw err;
  }
}
