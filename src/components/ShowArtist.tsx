import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { User, Artist, Release } from "../interfaces/types";

interface ShowArtistProps {
  user: User | null;
}

function ShowArtist({ user }: ShowArtistProps) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Artist>>({});
  const { artistId } = useParams<{ artistId?: string }>();
  const navigate = useNavigate();

  async function fetchArtist() {
    if (!artistId) {
      setError("No artist ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get<Artist>(`/api/artists/${artistId}`);
      console.log("Fetched artist data:", response.data);
      
      if (!response.data) {
        throw new Error("No data received from server");
      }

      setArtist(response.data);
      setEditForm(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching artist:", error);
      setError("Failed to fetch artist details. Please try again later.");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchArtist();
  }, [artistId]);

  useEffect(() => {
    const newReleaseAdded = localStorage.getItem('newReleaseAdded');
    if (newReleaseAdded === 'true') {
      fetchArtist();
      localStorage.removeItem('newReleaseAdded');
    }
  }, []);

  async function deleteArtist() {
    if (!artist) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      await axios.delete(`/api/artists/${artist._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/artists");
    } catch (error) {
      console.error("Error deleting artist:", error);
      setError("Failed to delete artist. Are you the orignal poster?");
    }
  }

  async function updateArtist(e: React.FormEvent) {
    e.preventDefault();
    if (!artist) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const updateData: Partial<Artist> = {
        ...editForm,
        user: artist.user
      };

      const response = await axios.put<Artist>(
        `/api/artists/${artist._id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setArtist(prevArtist => {
        if (!prevArtist) return response.data;
        return {
          ...prevArtist,
          ...response.data,
          user: prevArtist.user,
          releases: prevArtist.releases
        };
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating artist:", error);
      setError("Failed to update release. Are you the orignal poster?");
    }
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  }

  if (loading) {
    return <div className="section"><div className="container"><p>Loading artist details...</p></div></div>;
  }

  if (error) {
    return <div className="section"><div className="container"><p className="has-text-danger">{error}</p></div></div>;
  }

  if (!artist) {
    return <div className="section"><div className="container"><p>Artist not found.</p></div></div>;
  }

  const canEdit = user && artist.user && user._id === artist.user._id;


  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-one-third">
            <figure className="image is-square">
              <img src={artist.image} alt={artist.name} style={{objectFit: 'cover'}} />
            </figure>
          </div>
          <div className="column">
            {isEditing ? (
              <form onSubmit={updateArtist}>
                <div className="field">
                  <label className="label">Name</label>
                  <div className="control">
                    <input 
                      className="input" 
                      type="text" 
                      name="name" 
                      value={editForm.name || ''} 
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
                  <label className="label">Country</label>
                  <div className="control">
                    <input 
                      className="input" 
                      type="text" 
                      name="country" 
                      value={editForm.country || ''} 
                      onChange={handleEditChange} 
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Formed Year</label>
                  <div className="control">
                    <input 
                      className="input" 
                      type="number" 
                      name="formedYear" 
                      value={editForm.formedYear || ''} 
                      onChange={handleEditChange} 
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Biography</label>
                  <div className="control">
                    <textarea 
                      className="textarea" 
                      name="biography" 
                      value={editForm.biography || ''} 
                      onChange={handleEditChange} 
                    />
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
                <h1 className="title is-2">{artist.name}</h1>
                <p className="subtitle is-4">{artist.country}</p>
                <div className="content">
                  <p><strong>Year formed:</strong> {artist.formedYear}</p>
                  <p><strong>Genre:</strong> {artist.genre}</p>
                  <p><strong>Biography:</strong> {artist.biography}</p>
                  <p><strong>Added by:</strong> {artist.user?.username}</p>
                </div>
                {user && artist.user && user._id === artist.user._id && (
                  <div className="buttons">
                    <button onClick={() => setIsEditing(true)} className="button is-primary">
                      Edit Artist
                    </button>
                    <button onClick={deleteArtist} className="button is-danger">
                      Delete Artist
                    </button>
                  </div>
                )}
              </>
            )}
            <h2 className="title is-4 mt-6">Releases</h2>
            {artist.releases && artist.releases.length > 0 ? (
              <div className="columns is-multiline">
                {artist.releases.map((release: Release) => (
                  <div key={release._id} className="column is-half">
                    <div className="box">
                      <article className="media">
                        <div className="media-left">
                          <figure className="image is-64x64">
                            <img src={release.image || '/default-album-cover.jpg'} alt={release.title} />
                          </figure>
                        </div>
                        <div className="media-content">
                          <div className="content">
                            <p>
                              <strong><Link to={`/releases/${release._id}`}>{release.title}</Link></strong>
                              <br />
                              <small>{release.year} • {release.genre} • {release.releaseType}</small>
                            </p>
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No releases yet.</p>
            )}
            <div className="mt-4">
            <Link 
            to="/releases/new" 
            state={{ artistId: artist._id }}
            className="button is-primary"
            >
                Add New Release
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShowArtist;