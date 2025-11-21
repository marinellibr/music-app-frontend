import React from "react";
import "./profileSelection.css";

export default function ProfileSelection() {
  // Dados dos perfis conforme solicitado
  const profiles = [
    { id: "1", name: "Kyle", value: "6920a600249f12125fd1b4f3" },
    { id: "2", name: "Stan", value: "691f7a7f249f12125fd1b4f2" },
    { id: "3", name: "Genérico", value: "691555322217fbbfe1c76781" },
  ];

  const handleSelectProfile = (userId: string) => {
    localStorage.setItem("userId", userId);
    window.location.href = "/profile";
  };

  return (
    <div className="profile-container">
      <h1>Select a profile:</h1>
      <div className="profile-card">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="profile-item"
            onClick={() => handleSelectProfile(profile.value)}
          >
            <span className="profile-name">
              Perfil {profile.id}: {profile.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
