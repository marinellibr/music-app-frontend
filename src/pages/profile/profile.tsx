import React, { useEffect, useState } from "react";
import "./profile.css";
import { User } from "../../models/user.model";
import PostComponent from "../../components/post/post";
import { getUserById } from "../../services/userService";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = "691f7a7f249f12125fd1b4f2";
    // const id = "691555322217fbbfe1c7677e";

    try {
      localStorage.setItem("userId", id);
      console.log(`ID do usuário salvo no localStorage: ${id}`);
    } catch (e) {
      console.error("Erro ao salvar o userId no localStorage:", e);
    }

    let mounted = true;

    async function loadUser() {
      try {
        const data = await getUserById(id);

        if (mounted) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Erro ao carregar usuário:", err);
        if (mounted) setError(message);
      }
    }

    loadUser();

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
