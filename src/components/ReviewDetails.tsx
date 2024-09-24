import React from "react";
import { Link } from "react-router-dom";
import { User, Review } from "../interfaces/types";

interface ReviewDetailsProps {
  review: Review;
  user: User | null;
  deleteReview: (reviewId: string) => Promise<void>;
  handleEditReview: (review: Review) => void;
}

const ReviewDetails: React.FC<ReviewDetailsProps> = ({ review, user, deleteReview, handleEditReview }) => {
  return (
    <>
      <p>
        <strong>Rating:</strong> {review.stars}/5
      </p>
      {review.favouriteTrack && (
        <p>
          <strong>Favourite Track:</strong> {review.favouriteTrack}
        </p>
      )}
      {review.text && <p>{review.text}</p>}
      <p className="is-size-7 mt-2">
        - {review.user ? <Link to={`/users/${review.user._id}`}>{review.user.username}</Link> : "Anonymous"}
      </p>
      {user && review.user && user._id === review.user._id && (
        <div className="buttons mt-3">
          <button onClick={() => handleEditReview(review)} className="button is-small is-info">
            Edit Review
          </button>
          <button onClick={() => deleteReview(review._id)} className="button is-small is-danger">
            Delete Review
          </button>
        </div>
      )}
    </>
  );
};

export default ReviewDetails;