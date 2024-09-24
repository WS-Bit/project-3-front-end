import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { User, Release, Review, Artist } from "../interfaces/types";
import ArtistSelect from "./ArtistSelect";
import EditReview from "./EditReview";
import ReleaseForm from "./ReleaseForm";
import ReleaseDetails from "./ReleaseDetails";
import ReviewForm from "./ReviewForm";
import ReviewDetails from "./ReviewDetails";

interface ShowReleaseProps {
  user: User | null;
}

function ShowRelease({ user }: ShowReleaseProps) {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [trackList, setTrackList] = useState<string[]>([]);
  const [newReview, setNewReview] = useState<Partial<Review>>({
    stars: 0,
    text: "",
    favouriteTrack: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Release>>({});
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editReviewForm, setEditReviewForm] = useState<Partial<Review>>({});
  const { releaseId } = useParams<{ releaseId?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRelease();
    fetchArtists();
  }, [releaseId]);

  useEffect(() => {
    if (release?.trackList) {
      setTrackList(release.trackList);
    }
  }, [release]);

  async function fetchRelease() {
    if (!releaseId) {
      setError("No release ID provided");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get<Release>(`/api/releases/${releaseId}`);
      const fetchedRelease = {
        ...response.data,
        artist: response.data.artist as Artist,
      };

      setRelease(fetchedRelease);
      setEditForm(fetchedRelease);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching release:", error);
      setError("Failed to fetch release details. Please try again later.");
      setLoading(false);
    }
  }

  async function fetchArtists() {
    try {
      const response = await axios.get<Artist[]>("/api/artists");
      setArtists(response.data);
    } catch (error) {
      console.error("Error fetching artists:", error);
      setError("Failed to fetch artists. Please try again later.");
    }
  }

  async function deleteRelease() {
    if (!release) return;
    try {
      const token = getToken();
      await axios.delete(`/api/releases/${release._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/releases");
    } catch (error) {
      console.error("Error deleting release:", error);
      setError("Failed to delete release. Are you the original poster?");
    }
  }

  async function updateRelease(e: React.FormEvent) {
    e.preventDefault();
    if (!release) return;
    try {
      const token = getToken();
      const updatedRelease = {
        ...editForm,
        trackList,
        user: release.user,
        artist: editForm.artist,
      };

      const response = await axios.put<Release>(
        `/api/releases/${release._id}`,
        updatedRelease,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRelease({
        ...response.data,
        user: release.user,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating release:", error);
      setError("Failed to update release. Are you the original poster?");
    }
  }

  async function createReview(e: React.FormEvent) {
    e.preventDefault();
    if (!release || !user) {
      setError("Unable to submit review: Release or user information is missing.");
      return;
    }
    try {
      const token = getToken();
      const response = await axios.post<Review>(
        `/api/releases/${release._id}/reviews`,
        {
          ...newReview,
          user: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedReviews = Array.isArray(release.reviews)
        ? [...release.reviews, response.data]
        : release.reviews
        ? [release.reviews, response.data]
        : [response.data];

      setRelease({
        ...release,
        reviews: updatedReviews,
      });

      setNewReview({ stars: 0, text: "", favouriteTrack: "" });
    } catch (error) {
      console.error("Error creating review:", error);
      if (axios.isAxiosError(error)) {
        setError(`Failed to create review: ${error.response?.data?.message || error.message}`);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  }

  async function deleteReview(reviewId: string) {
    if (!release) return;
    try {
      const token = getToken();
      await axios.delete(`/api/releases/${release._id}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedReviews = Array.isArray(release.reviews)
        ? release.reviews.filter((review) => review._id !== reviewId)
        : [];

      setRelease({
        ...release,
        reviews: updatedReviews,
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      if (axios.isAxiosError(error)) {
        setError(`Failed to delete review: ${error.response?.data?.message || error.message}`);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  }

  async function updateReview(reviewId: string, updatedReview: Partial<Review>) {
    if (!release) return;
    try {
      const token = getToken();
      const response = await axios.put<Review>(
        `/api/releases/${release._id}/reviews/${reviewId}`,
        updatedReview,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedReviews = Array.isArray(release.reviews)
        ? release.reviews.map((review) => (review._id === reviewId ? response.data : review))
        : [response.data];

      setRelease({
        ...release,
        reviews: updatedReviews,
      });
    } catch (error) {
      console.error("Error updating review:", error);
      if (axios.isAxiosError(error)) {
        setError(`Failed to update review: ${error.response?.data?.message || error.message}`);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  }

  function getToken() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
    return token;
  }

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: name === "stars" ? parseInt(value) : value,
    }));
  };

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleTrackListChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const tracks = e.target.value.split("\n");
    setTrackList(tracks);
  }

  const handleEditReview = (review: Review) => {
    setEditingReview(review._id);
    setEditReviewForm({
      stars: review.stars,
      favouriteTrack: review.favouriteTrack,
      text: review.text,
    });
  };

  const handleEditReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditReviewForm((prev) => ({
      ...prev,
      [name]: name === "stars" ? parseInt(value) : value,
    }));
  };

  const handleUpdateReview = async (e: React.FormEvent, reviewId: string) => {
    e.preventDefault();
    await updateReview(reviewId, editReviewForm);
    setEditingReview(null);
  };

  const renderTrackList = () => {
    if (!release || !release.trackList) {
      return <p>No tracks available.</p>;
    }

    return (
      <ol>
        {release.trackList.map((track, index) => (
          <li key={index}>{track}</li>
        ))}
      </ol>
    );
  };
  
  const renderReviews = () => {
    if (!release || !release.reviews) {
      return <p>No reviews yet.</p>;
    }

    const reviewsArray: Review[] = Array.isArray(release.reviews)
      ? release.reviews
      : release.reviews
      ? [release.reviews]
      : [];

    if (reviewsArray.length === 0) {
      return <p>No reviews yet.</p>;
    }

    return reviewsArray.map((review) => (
      <div key={review._id} className="box">
        {editingReview === review._id ? (
          <EditReview
            review={review}
            editReviewForm={editReviewForm}
            handleEditReviewChange={handleEditReviewChange}
            handleUpdateReview={handleUpdateReview}
            setEditingReview={setEditingReview}
          />
        ) : (
          <ReviewDetails review={review} user={user} deleteReview={deleteReview} handleEditReview={handleEditReview} />
        )}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <p>Loading release details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <div className="container">
          <p className="has-text-danger">{error}</p>
        </div>
      </div>
    );
  }

  if (!release) {
    return (
      <div className="section">
        <div className="container">
          <p>Release not found.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-one-third">
            <figure className="image is-square">
              <img src={release.image} alt={release.title} style={{ objectFit: "cover" }} />
            </figure>
          </div>
          <div className="column">
            {isEditing ? (
              <ReleaseForm
                artists={artists}
                editForm={editForm}
                handleEditChange={handleEditChange}
                handleTrackListChange={handleTrackListChange}
                trackList={trackList}
                updateRelease={updateRelease}
                setIsEditing={setIsEditing}
              />
            ) : (
              <>
                <h1 className="title is-2">{release.title}</h1>
                <ReleaseDetails release={release} renderTrackList={renderTrackList} />
                {user && release.user && user._id === release.user._id && (
                  <div className="buttons">
                    <button onClick={() => setIsEditing(true)} className="button is-primary">
                      Edit Release
                    </button>
                    <button onClick={deleteRelease} className="button is-danger">
                      Delete Release
                    </button>
                  </div>
                )}
              </>
            )}

            <h2 className="title is-4 mt-6">Reviews</h2>
            {renderReviews()}

            {user && (
              <div className="box mt-5">
                <h3 className="title is-5">Add a Review</h3>
                <ReviewForm newReview={newReview} handleReviewChange={handleReviewChange} createReview={createReview} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShowRelease;