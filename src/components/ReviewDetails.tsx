import React from "react";
import { Link } from "react-router-dom";
import { User, Review } from "../interfaces/types";
import styles from '../styles/Pagination.module.css';

interface ReviewDetailsProps {
  review: Review;
  user: User | null;
  deleteReview: (reviewId: string) => Promise<void>;
  handleEditReview: (review: Review) => void;
}

const ReviewDetails = ({ review, user, deleteReview, handleEditReview }: ReviewDetailsProps) => {
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <i key={i} className={`fas fa-star ${i < rating ? 'has-text-warning' : 'has-text-grey-lighter'}`}></i>
    ));
  };

  return (
    <>
      <p>
        <strong>Rating:</strong> {renderStars(review.stars)}
      </p>
      {review.favouriteTrack && (
        <p>
          <strong>Favourite Track:</strong> {review.favouriteTrack}
        </p>
      )}
      {review.text && <p>{review.text}</p>}
      <p className="is-size-7 mt-2">
        - {review.user && review.user._id ? (
          <Link to={`/user/${review.user._id}/profile`} className={styles.yellowLink}>{review.user.username}</Link>
        ) : (
          "Anonymous"
        )}
      </p>
      {user && review.user && review.user._id && user._id === review.user._id && (
        <div className="buttons mt-3">
          <button onClick={() => handleEditReview(review)} className="button is-small is-warning">
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