import React, { useEffect, useState } from "react";
import "./profile.css";
import { User } from "../../models/user.model";
import PostComponent from "../../components/post/post";
import { getUserById } from "../../services/userService";
import Shimmer from "../../components/shimmer/shimmer";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import logoutWhite from "../../assets/svg/logoutWhite.svg";

function ProfileSkeleton() {
  return (
    <div>
      <Header iconRight={logoutWhite} />
      <div className="profile--container">
        <section className="profile--header">
          <div style={{ minWidth: "96px", minHeight: "96px" }}>
            <Shimmer width={96} height={96} radius={48} />
          </div>
          <div className="profile--info">
            <Shimmer width={120} height={19} radius={4} />
            <Shimmer width={180} height={16} radius={4} />
            <div>
              <Shimmer width={200} height={76} radius={4} />
            </div>
            <div className="profile--stats">
              <Shimmer width={50} height={36} radius={4} />
              <Shimmer width={50} height={36} radius={4} />
              <Shimmer width={50} height={36} radius={4} />
            </div>
          </div>
        </section>
        <section className="profile--tabs">
          <div className="profile--tab">
            <Shimmer width={60} height={16} radius={4} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("userId");

    if (!storedId) {
      navigate("/music-app-frontend");
      return;
    }

    let mounted = true;

    async function loadUser() {
      try {
        const data = await getUserById(storedId!);
        if (mounted) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (mounted) setError(message);
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("userId");
    navigate("/music-app-frontend");
  }

  if (!user) {
    if (error) {
      return (
        <div className="profile--container">
          <div className="error">Error: {error}</div>
        </div>
      );
    }
    return <ProfileSkeleton />;
  }

  return (
    <div>
      <Header
        centerText={user.username}
        iconRight={logoutWhite}
        actionIconRight={handleLogout}
      />
      <div className="profile--container">
        <section className="profile--header">
          <img src={user.profilePictureUrl} alt="Profile" />
          <div className="profile--info">
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
    </div>
  );
}
