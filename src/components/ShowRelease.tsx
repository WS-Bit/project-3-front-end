import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { User, Release, Review, Artist } from "../interfaces/types";
import ArtistSelect from "./ArtistSelect";
import ReleaseDetails from "./ReleaseDetails";

interface ShowReleaseProps {
  user: User | null;
}

interface UserDetails {
  _id: string;
  username: string;
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
    favouriteTrack: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Release>>({});
  const { releaseId } = useParams<{ releaseId?: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (release?.trackList) {
      setTrackList(release.trackList);
    }
  }, [release]);

  useEffect(() => {
    async function fetchRelease() {
      if (!releaseId) {
        setError("No release ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<Release>(`/api/releases/${releaseId}`);
        console.log("Fetched release data:", response.data);
        
        if (!response.data) {
          throw new Error("No data received from server");
        }

        const fetchedRelease = {
          ...response.data,
          artist: response.data.artist as Artist
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

    fetchRelease();
  }, [releaseId]);

  

  useEffect(() => {
    async function fetchArtists() {
      try {
        const response = await axios.get<Artist[]>('/api/artists');
        setArtists(response.data);
      } catch (error) {
        console.error('Error fetching artists:', error);
        setError('Failed to fetch artists. Please try again later.');
      }
    }

    fetchArtists();
  }, []);

  async function deleteRelease() {
    if (!release) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      await axios.delete(`/api/releases/${release._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/releases");
    } catch (error) {
      console.error("Error deleting release:", error);
      setError("Failed to delete release. Are you the orignal poster?");
    }
  }

  async function updateRelease(e: React.FormEvent) {
    e.preventDefault();
    if (!release) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

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
      console.error('Error updating release:', error);
      setError('Failed to update release. Are you the orignal poster?');
    }
  }

  async function createReview(e: React.FormEvent) {
    e.preventDefault();
    if (!release || !user) {
      console.error("Release or user is null");
      setError("Unable to submit review: Release or user information is missing.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
  
      console.log("Submitting review:", newReview);
      console.log("For release:", release._id);
      console.log("By user:", user._id);
  
      const response = await axios.post<Review>(
        `/api/releases/${release._id}/reviews`,
        {
          ...newReview,
          user: user._id
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
  
      console.log("Server response:", response.data);
  
      setRelease((prevRelease) => {
        if (!prevRelease) return null;
      
        const reviewsArray = Array.isArray(prevRelease.reviews)
          ? prevRelease.reviews
          : prevRelease.reviews
          ? [prevRelease.reviews]
          : [];
      
        const updatedReviews = [...reviewsArray, response.data];
      
        return { ...prevRelease, reviews: updatedReviews };
      });
      
      setNewReview({ stars: 0, text: "", favouriteTrack: "" });
      console.log("Review submitted successfully");
    } catch (error) {
      console.error("Error creating review:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
        setError(`Failed to create review: ${error.response?.data?.message || error.message}`);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  }

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: name === 'stars' ? parseInt(value) : value
    }));
  };

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  }

  function handleTrackListChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const tracks = e.target.value.split("\n");
    setTrackList(tracks);
  }

  const renderTrackList = () => {
    if (!release?.trackList || release.trackList.length === 0) {
      return <p>No track list available.</p>;
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
  
    return reviewsArray.map((review: Review) => (
      <div key={review._id} className="box">
        <p><strong>Rating:</strong> {review.stars}/5</p>
        {review.favouriteTrack && (
          <p><strong>Favourite Track:</strong> {review.favouriteTrack}</p>
        )}
        {review.text && <p>{review.text}</p>}
        <p className="is-size-7 mt-2">
          - {review.user ? (
            <Link to={`/users/${review.user._id}`}>{review.user.username}</Link>
          ) : (
            "Anonymous"
          )}
        </p>
      </div>
    ));
  };

  if (loading) {
    return <div className="section"><div className="container"><p>Loading release details...</p></div></div>;
  }

  if (error) {
    return <div className="section"><div className="container"><p className="has-text-danger">{error}</p></div></div>;
  }

  if (!release) {
    return <div className="section"><div className="container"><p>Release not found.</p></div></div>;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-one-third">
            <figure className="image is-square">
              <img src={release.image} alt={release.title} style={{objectFit: 'cover'}} />
            </figure>
          </div>
          <div className="column">
            {isEditing ? (
              <form onSubmit={updateRelease}>
                <div className="field">
                  <label className="label">Title</label>
                  <div className="control">
                    <input 
                      className="input" 
                      type="text" 
                      name="title" 
                      value={editForm.title || ''} 
                      onChange={handleEditChange} 
                    />
                  </div>
                </div>

                <ArtistSelect
                  artists={artists}
                  value={(editForm.artist as Artist)?._id || ''}
                  onChange={handleEditChange}
                />

                <div className="field">
                  <label className="label">Year</label>
                  <div className="control">
                    <input 
                      className="input" 
                      type="number" 
                      name="year" 
                      value={editForm.year || ''} 
                      onChange={handleEditChange} 
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Genre</label>
                  <div className="control">
                    <input 
                      className="input" 
                      type="text" 
                      name="genre" 
                      value={editForm.genre || ''} 
                      onChange={handleEditChange} 
                    />
                  </div>
                </div>
                
                <div className="field">
                  <label className="label">Release Type</label>
                  <div className="control">
                    <div className="select">
                      <select 
                        name="releaseType" 
                        value={editForm.releaseType || ''} 
                        onChange={handleEditChange}
                      >
                        <option value="Single">Single</option>
                        <option value="Album">Album</option>
                        <option value="EP">EP</option>
                        <option value="Mixtape">Mixtape</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Track List</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      name="trackList"
                      value={trackList.join("\n")}
                      onChange={handleTrackListChange}
                      rows={Math.max(5, trackList.length)}
                    ></textarea>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Image URL</label>
                  <div className="control">
                    <input 
                      className="input" 
                      type="text" 
                      name="image" 
                      value={editForm.image || ''} 
                      onChange={handleEditChange} 
                    />
                  </div>
                </div>

                <div className="field is-grouped">
                  <div className="control">
                    <button type="submit" className="button is-primary">Save Changes</button>
                  </div>
                  <div className="control">
                    <button type="button" className="button is-light" onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                </div>
              </form>
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
                    <div className="control"><br/>
                      <button type="submit" className="button is-primary">Submit Review</button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShowRelease;