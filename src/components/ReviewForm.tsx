import React from "react";
import { Review } from "../interfaces/types";

interface ReviewFormProps {
  newReview: Partial<Review>;
  handleReviewChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  createReview: (e: React.FormEvent) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ newReview, handleReviewChange, createReview }) => {
  return (
    <form onSubmit={createReview}>
      <div className="field">
        <label className="label">Rating</label>
        <div className="control">
          <input
            className="input"
            type="number"
            name="stars"
            min="1"
            max="5"
            value={newReview.stars || ""}
            onChange={handleReviewChange}
            required
          />
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
          <button type="submit" className="button is-primary">
            Submit Review
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReviewForm;