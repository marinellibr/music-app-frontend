import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Profile from "./pages/profile/profile";
import "./App.css";
import spotifyService from "./services/spotifyService";
import Search from "./pages/search/search";
import Review from "./pages/review/review";
import Error from "./pages/error/error";
import ProfileSelection from "./pages/profileSelection/profileSelection";
import searchLens from "./assets/svg/searchLensWhite.svg";
import review from "./assets/svg/reviewWhite.svg";
import profile from "./assets/svg/profileWhite.svg";

const App: React.FC = () => {
  useEffect(() => {
    spotifyService.init();
  }, []);
  return (
    <BrowserRouter>
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          padding: "12px 0",
          display: "flex",
          justifyContent: "center",
          gap: 24,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          zIndex: 1000,
        }}
      >
        <Link to="/search" style={{ width: "32px", height: "32px" }}>
          <img
            src={searchLens}
            alt=""
            style={{ width: "32px", height: "32px" }}
          />
        </Link>
        <Link to="/review" style={{ width: "32px", height: "32px" }}>
          <img src={review} alt="" style={{ width: "32px", height: "32px" }} />
        </Link>
        <Link to="/profile" style={{ width: "32px", height: "32px" }}>
          <img src={profile} alt="" style={{ width: "32px", height: "32px" }} />
        </Link>
      </nav>

      <Routes>
        <Route path="/music-app-frontend" element={<ProfileSelection />} />
        <Route path="/error" element={<Error />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/review/:media?/:id?" element={<Review />} />
        <Route path=" " element={<Navigate to="/profile" replace />} />
        <Route path="" element={<Navigate to="/profile" replace />} />
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
