import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./search.css";
import { search } from "../../services/spotifyService";

interface TrackItem {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    release_date: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
}

interface SearchResult {
  tracks?: {
    items: TrackItem[];
  };
}

export default function Search() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch(searchTerm);
      } else {
        setSearchResults(null);
        setError(null);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const performSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await search<SearchResult>(query, [
        "track",
        "album",
        "artist",
      ]);
      setSearchResults(results);
    } catch (err) {
      setError(
        "Não foi possível realizar a busca. Verifique a conexão com a API."
      );
      setSearchResults(null);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getYear = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).getFullYear().toString();
  };

  const handleItemClick = (mediaType: string, mediaId: string) => {
    navigate(`/review/${mediaType}/${mediaId}`);
  };

  const tracks = searchResults?.tracks?.items || [];

  return (
    <div className="search-container">
      <h3 className="search-title">Search:</h3>

      <input
        type="text"
        placeholder=""
        value={searchTerm}
        onChange={handleInputChange}
        className="search-input"
      />

      {isLoading && <p className="status-message empty">Loading...</p>}

      {error && (
        <p className="status-message" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!isLoading && !error && tracks.length > 0 && (
        <div>
          {tracks.map((track) => (
            <div key={track.id}>
              <div
                className="search-item"
                onClick={() => handleItemClick("track", track.id)}
              >
                <img
                  src={track.album.images[0]?.url || "placeholder.png"}
                  alt={`Capa do álbum`}
                  className="search-item-image"
                />

                <div>
                  <div className="search-item-title">{track.name}</div>

                  <div className="search-item-details">
                    {track.artists[0]?.name} •{" "}
                    {getYear(track.album.release_date)}
                  </div>
                </div>
              </div>

              <div className="search-separator"></div>
            </div>
          ))}
        </div>
      )}

      {!searchTerm.trim() && !tracks.length && (
        <p className="status-message empty">Type something to search...</p>
      )}

      {!isLoading &&
        !error &&
        hasSearched &&
        !tracks.length &&
        searchTerm.trim() && (
          <p className="status-message">No results found for "{searchTerm}".</p>
        )}
    </div>
  );
}
