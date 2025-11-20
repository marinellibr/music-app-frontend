import React, { useEffect, useState } from "react";
import "./profile.css";
import { User, Post } from "../../models/user.model";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userPostsMediaData, setUserPostsMediaData] = useState<any[]>([]);

  // Busca em paralelo os dados de mídia para os posts
  async function fetchMediaData(baseUrl: string, posts: Post[]): Promise<any[]> {
    const mediaFetches = posts.map((p: Post) =>
      fetch(`${baseUrl}/${p.mediaType}/${p.mediaId}`).then((r) => {
        if (!r.ok) throw new Error(`Media HTTP ${r.status}`);
        return r.json();
      })
    );

    return Promise.all(mediaFetches);
  }

  useEffect(() => {
    const id = "691555322217fbbfe1c7677d";
    const base = process.env.REACT_APP_ENDPOINT_API || "";
    const urlUser = `${base}/users/${id}`;

    let mounted = true;

    async function fetchUser() {
      try {
        const res = await fetch(urlUser);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: User = await res.json();
        console.log("Fetch URL:", urlUser);
        console.log("User data:", data);
        if (mounted) setUser(data);

        // Se houver posts, buscar os dados de mídia correspondentes em paralelo
        if (data.posts && data.posts.length > 0) {
          try {
            const mediaData = await fetchMediaData(base, data.posts);
            if (mounted) setUserPostsMediaData(mediaData);
            console.log("Fetched media data for posts:", mediaData);
          } catch (mediaErr) {
            console.error("Error fetching post media data:", mediaErr);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Fetch error:", err);
        if (mounted) setError(message);
      }
    }

    fetchUser();
    return () => {
      mounted = false;
    };
  }, []);

  if (!user) {
    return (
      <div className="profile--container">
        <section className="profile--header">
          <div className="profile--info">
            {error ? (
              <div className="error">Erro: {error}</div>
            ) : (
              <div>Carregando...</div>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="profile--container">
      <section className="profile--header">
        <img src={user.profilePictureUrl} alt="Profile Picture" />
        <div className="profile--info">
          <h1>@{user.username}</h1>
          <h2>{user.name}</h2>

          <span className="profile--bio">{user.bio}</span>

          <div className="profile--stats">
            <div className="stats">
              <h4>posts</h4>
              <span>{user.posts?.length ?? 0}</span>
            </div>
            <div className="stats">
              <h4>followers</h4>
              <span>{user.followersCount ?? 0}</span>
            </div>
            <div className="stats">
              <h4>following</h4>
              <span>{user.followingCount ?? 0}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="profile--tabs">
        <div className="profile--tab">
          <h1>reviews</h1>
        </div>
      </section>
      <section className="profile--posts">
        {user.posts && user.posts.length > 0 ? (
          user.posts.map((post) => (
            <article className="post" key={`${post.mediaId}-${post.createdAt}`}>
              <span className="post-mediaId">{post.mediaId}</span>
              <div className="post-content">{post.content}</div>
            </article>
          ))
        ) : (
          <div className="no-posts">Nenhum post</div>
        )}
      </section>
    </div>
  );
}
