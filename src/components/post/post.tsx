import { useEffect, useState } from "react";
import { Post } from "../../models/user.model";
import { Media } from "../../models/media.model";
import { loadPostsWithMediaDetails } from "../../services/userService";

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

  if (loading) return <div>Loading posts...</div>;

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
          <div className="posts-breathing"></div>
        </div>
      ))}
    </div>
  );
}
