import { useEffect, useState } from "react";
import { Post } from "../../models/user.model";
import { Media } from "../../models/media.model";
import spotifyService from "../../services/spotifyService";
import "./post.css";

interface Props {
  posts: Post[];
}

export default function PostComponent({ posts }: Props) {
  console.log("PostComponent received posts:", posts);
  const [mediaPosts, setMediaPosts] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMedia() {
      try {
        const results: Media[] = await Promise.all(
          posts.map(async (post) => {
            let mediaData: any;

            if (post.mediaType === "track") {
              mediaData = await spotifyService.getTrackById(post.mediaId);
              return {
                ...post,
                mediaName: mediaData.name,
                mediaArtist: mediaData.artists
                  .map((a: any) => a.name)
                  .join(", "),
                mediaCoverUrl: mediaData.album.images[0]?.url || "",
                mediaYear: mediaData.album.release_date.split("-")[0],
                mediaLink: mediaData.external_urls.spotify,
              };
            } else if (post.mediaType === "album") {
              mediaData = await spotifyService.getAlbumById(post.mediaId);

              return {
                ...post,
                mediaName: mediaData.name,
                mediaArtist: mediaData.artists
                  .map((a: any) => a.name)
                  .join(", "),
                mediaCoverUrl: mediaData.images[0]?.url || "",
                mediaYear: mediaData.release_date.split("-")[0],
                mediaLink: mediaData.external_urls.spotify,
              };
            }

            return { ...post } as Media;
          })
        );

        setMediaPosts(results);
        console.log(results);
      } catch (err) {
        console.error("Erro ao carregar posts com mídia:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMedia();
  }, [posts]);

  if (loading) return <div>Carregando posts...</div>;
  return (
    <div className="posts-container">
      {mediaPosts.map((post) => (
        <div key={post.mediaId} className="post-card">
          <img
            src={post.mediaCoverUrl}
            alt={post.mediaName}
            className="post-cover"
          />
          <div className="post-info">
            <div className="post-header">
              <h3 className="post-title">{post.mediaName}</h3>
              <span className="post-rating">{post.rating.toFixed(1)}</span>
            </div>
            <p className="post-artist-year">
              {post.mediaArtist} • {post.mediaYear}
            </p>
            <p className="post-content">{post.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
