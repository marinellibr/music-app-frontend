import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrackById } from "../../services/spotifyService";
import { createUserPost } from "../../services/userService";
import heartFilled from "../../assets/svg/heartFilled.svg";
import heartEmpty from "../../assets/svg/heartEmpty.svg";
import "./review.css";
import Header from "../../components/header/header";
import arrowLeft from "../../assets/svg/arrowLeftWhite.svg";
import confirm from "../../assets/svg/confirmWhite.svg";
import Shimmer from "../../components/shimmer/shimmer";

interface ReviewObject {
  mediaType: "album" | "track";
  mediaId: string;
  userId: string;
  rating: number;
  liked: boolean;
  content: string;
  createdAt: string;
}

function ReviewSkeleton() {
  return (
    <div>
      <Header centerText="review" iconLeft={arrowLeft} iconRight={confirm} />

      <div className="review-container">
        <div className="media-info">
          <Shimmer width={180} height={20} radius={4} />
          <div style={{ marginTop: 8 }}>
            <Shimmer width={140} height={16} radius={4} />
          </div>
        </div>

        <Shimmer width={172} height={172} radius={8} />

        <div className="rating-selector">
          <div className="rating-infos" style={{ width: "100%" }}>
            <Shimmer width={60} height={20} radius={4} />
            <Shimmer width={24} height={21} radius={4} />
          </div>

          <Shimmer width={272} height={8} radius={4} />

          <div className="rating-labels" style={{ width: "100%" }}>
            <Shimmer width={20} height={12} radius={4} />
            <Shimmer width={20} height={12} radius={4} />
          </div>
        </div>

        <div className="comment-wrapper">
          <Shimmer width={256} height={80} radius={8} />
          <div style={{ position: "absolute", bottom: 8, right: 12 }}>
            <Shimmer width={24} height={12} radius={4} />
          </div>
        </div>
      </div>
    </div>
  );
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

  const isCreatingWithoutId = !id;

  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    } catch {}

    if (id) {
      const fetchMediaDetails = async () => {
        try {
          const results = await getTrackById(id);
          setSelectedTrack(results);
        } catch {}
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

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCreatingWithoutId) return;
    setRating(parseFloat(e.target.value));
  };

  const handleFavoriteToggle = () => {
    if (isCreatingWithoutId) return;
    setIsFavorite((prev) => !prev);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (!id || !userId) return;

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = 144 - comment.length;

  return (
    <div>
      <Header
        centerText="review"
        iconLeft={arrowLeft}
        iconRight={confirm}
        actionIconLeft={() => navigate(-1)}
        actionIconRight={isCreatingWithoutId ? undefined : handleSubmit}
      />

      <div className="review-container">
        <div className="media-info">
          <h1>{selectedTrack?.name || "choose a track"}</h1>
          {selectedTrack ? (
            <span>
              {selectedTrack?.artists
                ?.map((artist: any) => artist.name)
                .join(", ")}{" "}
              • {getYear(selectedTrack?.album?.release_date)}
            </span>
          ) : (
            <span style={{ color: "#d9d9d9" }}>tap the box below</span>
          )}
        </div>

        {selectedTrack ? (
          <img
            src={selectedTrack?.album?.images[0]?.url}
            alt={selectedTrack?.name}
          />
        ) : (
          <div
            style={{
              width: 172,
              height: 172,
              backgroundColor: "#d9d9d9",
              borderRadius: 8,
              cursor: "pointer",
            }}
            onClick={() => navigate("/search")}
          />
        )}

        <div className="rating-selector">
          <div className="rating-infos">
            <div>
              <span className="rating-value">{rating.toFixed(1)}</span> / 10
            </div>

            <div>
              <img
                src={isFavorite ? heartFilled : heartEmpty}
                alt="Like"
                onClick={handleFavoriteToggle}
                style={{
                  cursor: isCreatingWithoutId ? "default" : "pointer",
                  opacity: isCreatingWithoutId ? 0.4 : 1,
                }}
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
            disabled={isCreatingWithoutId}
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
      </div>
    </div>
  );
}
