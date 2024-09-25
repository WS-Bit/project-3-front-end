import React from "react";
import { Review } from "../interfaces/types";

interface EditReviewProps {
  review: Review;
  editReviewForm: Partial<Review>;
  handleEditReviewChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleUpdateReview: (e: React.FormEvent, reviewId: string) => Promise<void>;
  setEditingReview: (reviewId: string | null) => void;
}

const EditReview = ({
  review,
  editReviewForm,
  handleEditReviewChange,
  handleUpdateReview,
  setEditingReview,
}: EditReviewProps) => {
  return (
    <form onSubmit={(e) => handleUpdateReview(e, review._id)}>
      <div className="field">
        <label className="label">Rating</label>
        <div className="control">
          <input
            className="input"
            type="number"
            name="stars"
            min="1"
            max="5"
            value={editReviewForm.stars || ""}
            onChange={handleEditReviewChange}
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
            value={editReviewForm.favouriteTrack || ""}
            onChange={handleEditReviewChange}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Review</label>
        <div className="control">
          <textarea
            className="textarea"
            name="text"
            value={editReviewForm.text || ""}
            onChange={handleEditReviewChange}
            required
          ></textarea>
        </div>
      </div>
      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-primary">
            Save Changes
          </button>
        </div>
        <div className="control">
          <button type="button" className="button is-light" onClick={() => setEditingReview(null)}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditReview;