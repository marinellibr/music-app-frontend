import { useEffect, useState } from "react";
import { Post } from "../../models/user.model";
import { Media } from "../../models/media.model";
import spotifyService from "../../services/spotifyService";
import heartFilled from "../../assets/svg/heartFilled.svg";
import "./post.css";

interface Props {
  posts: Post[];
}

export default function PostComponent({ posts }: Props) {
  const [mediaPosts, setMediaPosts] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMedia() {
      try {
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

        setMediaPosts(results);
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
            src={post.mediaCoverUrl || ""}
            alt={post.mediaName || ""}
            className="post-cover"
          />
          <div className="post-info">
            <div className="post-header">
              <h3 className="post-title">{post.mediaName || "Sem título"}</h3>
              <div className="post-icons">
                {post.liked && <img src={heartFilled} alt="Liked" />}
                <span className="post-rating">
                  {post.rating?.toFixed(1) || "0.0"}
                </span>
              </div>
            </div>
            <p className="post-artist-year">
              {post.mediaArtist || "Desconhecido"} • {post.mediaYear || ""}
            </p>
            <p className="post-content">{post.content || ""}</p>
          </div>
          <div className="posts-breathing"></div>
        </div>
      ))}
    </div>
  );
}
