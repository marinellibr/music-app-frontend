import React, { useEffect, useState } from "react";
import "./profile.css";
import { User } from "../../models/user.model";
import { UserMock } from "../../mocks/user.mock";
import PostComponent from "../../components/post/post";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // const id = "691555322217fbbfe1c7677d";
    const id = "691f7a7f249f12125fd1b4f2";
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
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Fetch error:", err);
        if (mounted) setError(message);

        const mock = UserMock;
        setUser(mock);
        console.log("Using mock user data:", mock);
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
          <h1>{user.username}</h1>
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
        <PostComponent posts={user.posts || []} />
      </section>
    </div>
  );
}
