import React from "react";
import { Review } from "../../interfaces/types";

interface ReviewFormProps {
  newReview: Partial<Review>;
  handleReviewChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  createReview: (e: React.FormEvent) => Promise<void>;
  handleStarClick: (rating: number) => void;
}

const ReviewForm = ({ newReview, handleReviewChange, createReview, handleStarClick }: ReviewFormProps) => {
  return (
    <form onSubmit={createReview}>
      <div className="field">
        <label className="label">Rating</label>
        <div className="control">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleStarClick(star)}
              style={{ cursor: 'pointer', fontSize: '1.5em' }}
            >
              <i className={`fas fa-star ${star <= (newReview.stars || 0) ? 'has-text-warning' : 'has-text-grey-lighter'}`}></i>
            </span>
          ))}
        </div>
      </div>
      <div className="field">
        <label className="label">Favourite Track</label>
        <div className="control">
          <input
            className="input"
            type="text"
            name="favouriteTrack"
            value={newReview.favouriteTrack || ""}
            onChange={handleReviewChange}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Review</label>
        <div className="control">
          <textarea
            className="textarea"
            name="text"
            value={newReview.text || ""}
            onChange={handleReviewChange}
            required
          ></textarea>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <br />
          <button type="submit" className="button is-warning">
            Submit Review
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReviewForm;