import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Profile from "./pages/profile/profile";
import "./App.css";

function Search() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Search</h1>
      <p>Página de busca (placeholder).</p>
    </div>
  );
}

function Review() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Review</h1>
      <p>Página de review (placeholder).</p>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <nav
        style={{
          padding: 12,
          display: "flex",
          gap: 12,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Link to="/profile">Profile</Link>
        <Link to="/search">Search</Link>
        <Link to="/review">Review</Link>
      </nav>

      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/review" element={<Review />} />
        <Route path="/" element={<Navigate to="/profile" replace />} />
        <Route
          path="*"
          element={
            <div style={{ padding: 24 }}>
              <h2>404 - Not Found</h2>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
