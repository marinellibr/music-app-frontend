import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrackById } from "../../services/spotifyService";
import { createUserPost } from "../../services/userService";
import heartFilled from "../../assets/svg/heartFilled.svg";
import heartEmpty from "../../assets/svg/heartEmpty.svg";
import "./review.css";

interface ReviewObject {
  mediaType: "album" | "track";
  mediaId: string;
  userId: string;
  rating: number;
  liked: boolean;
  content: string;
  createdAt: string;
}

export default function Review() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [rating, setRating] = useState(5.0);
  const [comment, setComment] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        console.warn("userId não encontrado no localStorage.");
      }
    } catch (e) {
      console.error("Erro ao acessar o localStorage para userId:", e);
    }

    if (id) {
      const fetchMediaDetails = async () => {
        try {
          const results = await getTrackById(id);
          setSelectedTrack(results);
        } catch (error) {
          console.error("Erro ao buscar detalhes da mídia:", error);
        }
      };
      fetchMediaDetails();
    } else {
      setSelectedTrack(null);
    }
  }, [id]);

  const getYear = (dateString: string | undefined) => {
    if (!dateString) return "";
    return dateString.substring(0, 4);
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRating(parseFloat(event.target.value));
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
  };

  const handleFavoriteToggle = () => {
    setIsFavorite((prev) => !prev);
  };

  const handleSubmit = async () => {
    if (!id) {
      alert("Erro: Mídia não identificada.");
      return;
    }

    if (!userId) {
      alert("Você precisa estar logado para fazer uma review.");
      return;
    }

    setIsSubmitting(true);

    const reviewData: ReviewObject = {
      mediaType: "track",
      mediaId: id,
      userId: userId,
      rating: rating,
      liked: isFavorite,
      content: comment,
      createdAt: new Date().toISOString(),
    };

    try {
      await createUserPost(userId, reviewData);
      navigate("/profile");
    } catch (error) {
      console.error("Falha ao enviar review:", error);
      alert("Ocorreu um erro ao salvar sua review. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = 144 - comment.length;

  return (
    <div>
      {id ? (
        <div className="review-container">
          <div className="media-info">
            <h1>{selectedTrack?.name}</h1>
            <span>
              {selectedTrack?.artists
                ?.map((artist: any) => artist.name)
                .join(", ")}
            </span>{" "}
            • <span>{getYear(selectedTrack?.album?.release_date)}</span>
          </div>

          <img
            src={selectedTrack?.album?.images[0]?.url}
            alt={selectedTrack?.name}
          />

          <div className="rating-selector">
            <div className="rating-infos">
              <div>
                <span className="rating-value">{rating.toFixed(1)}</span> / 10
              </div>
              <div>
                <img
                  src={isFavorite ? heartFilled : heartEmpty}
                  alt="Favoritar"
                  onClick={handleFavoriteToggle}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>

            <input
              type="range"
              min="0.0"
              max="10"
              step="0.1"
              value={rating}
              onChange={handleRatingChange}
              className="rating-input"
            />
            <div className="rating-labels">
              <span>0</span>
              <span>10</span>
            </div>
          </div>

          <div className="comment-wrapper">
            <textarea
              placeholder="express yourself..."
              className="review-comment"
              maxLength={144}
              rows={4}
              value={comment}
              onChange={handleCommentChange}
              disabled={isSubmitting}
            />
            <div className="char-counter">{remainingChars}</div>
          </div>

          <div className="review-action">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? "sending..." : "review"}
            </button>
          </div>
        </div>
      ) : (
        <h1>Página de Revisão Geral</h1>
      )}
    </div>
  );
}
