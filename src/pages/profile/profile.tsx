import React, { useEffect } from "react";
import "../../App.css";

export default function Profile() {
  useEffect(() => {
    const id = "691555322217fbbfe1c7677d";
    const base = process.env.REACT_APP_ENDPOINT_API || "";
    const url = `${base}/users/${id}`;

    async function fetchUser() {
      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("Fetch URL:", url);
        console.log("User data:", data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="Profile-page" style={{ padding: 24 }}>
      <h1>Profile</h1>
      <p>Verifique o console do navegador para o resultado do fetch.</p>
    </div>
  );
}
