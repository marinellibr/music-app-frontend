import { useEffect, useState } from "react";
import { Post } from "../../models/user.model";
import { Media } from "../../models/media.model";
import { loadPostsWithMediaDetails } from "../../services/userService";
import heartFilled from "../../assets/svg/heartFilled.svg";
import "./post.css";
import Shimmer from "../shimmer/shimmer";

function PostSkeleton() {
  return (
    <div className="posts-container">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="post-card">
          <Shimmer width={40} height={40} radius={2} />
          <div className="post-info">
            <div className="post-header">
              <Shimmer width={160} height={18} radius={4} />
              <div className="post-icons">
                <Shimmer width={40} height={22} radius={12} />
              </div>
            </div>
            <div style={{ marginTop: "6px", marginBottom: "8px" }}>
              <Shimmer width={120} height={14} radius={4} />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <Shimmer width={280} height={14} radius={4} />
              <Shimmer width={200} height={14} radius={4} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface Props {
  posts: Post[];
}

export default function PostComponent({ posts }: Props) {
  const [mediaPosts, setMediaPosts] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMedia() {
      if (posts.length === 0) {
        setLoading(false);
        setMediaPosts([]);
        return;
      }

      setLoading(true);
      try {
        const results = await loadPostsWithMediaDetails(posts);
        setMediaPosts(results);
      } catch (err) {
        console.error("Error fetching posts with media details: ", err);
        setMediaPosts(posts as Media[]);
      } finally {
        setLoading(false);
      }
    }

    loadMedia();
  }, [posts]);

  if (loading) return <PostSkeleton />;

  return (
    <div className="posts-container">
      {mediaPosts.map((post, index) => (
        <div key={post.mediaId + index} className="post-card">
          <img
            src={post.mediaCoverUrl || ""}
            alt={post.mediaName || ""}
            className="post-cover"
          />
          <div className="post-info">
            <div className="post-header">
              <h3 className="post-title">{post.mediaName || "Sem título"}</h3>
              <div className="post-icons">
                {post.liked && (
                  <img className="post-icon" src={heartFilled} alt="Liked" />
                )}
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
        </div>
      ))}
      <div className="posts-breathing"></div>
    </div>
  );
}
