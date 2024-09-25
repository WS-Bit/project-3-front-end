import React, { useState, SyntheticEvent, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Artist } from "../interfaces/types";

interface CreateReleaseProps {
  user: User | null;
}

function CreateRelease({ user }: CreateReleaseProps) {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    artist: "",
    year: "",
    genre: "",
    trackList: "",
    releaseType: "Album",
    user: user?._id || ""
  });

  const [errorData, setErrorData] = useState({
    title: "",
    image: "",
    artist: "",
    year: "",
    genre: "",
    trackList: "",
    releaseType: "",
    user: user?._id || ""
  });

  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    async function fetchArtists() {
      try {
        const response = await axios.get<Artist[]>('/api/artists');
        setArtists(response.data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    }

    fetchArtists();
  }, []);

  function formatTrackList(tracks: string): string {
    return tracks
      .split('\n')
      .filter(track => track.trim() !== '')
      .map((track, index) => {
        
        if (/^\d+\.?\s/.test(track.trim())) {
          return track.trim(); 
        } else {
          return `${index + 1}. ${track.trim()}`; 
        }
      })
      .join('\n');
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token");
      const trackListArray = formData.trackList
        .split('\n')
        .map(track => track.trim())
        .filter(track => track !== '');
  
      const response = await axios.post(
        "/api/releases",
        {
          ...formData,
          trackList: trackListArray,
          artist: selectedArtist || formData.artist,
          user: user?._id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      localStorage.setItem('newReleaseAdded', 'true');
      navigate(`/artists/${selectedArtist || response.data.artist}`);
    } catch (error: any) {
      setErrorData(error.response.data.errors || {});
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }

  function handleArtistChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedArtist(e.target.value);
    if (e.target.value === "new") {
      setFormData(prevData => ({ ...prevData, artist: "" }));
    } else {
      setFormData(prevData => ({ ...prevData, artist: e.target.value }));
    }
  }

  if (!user) {
    return <div>Please log in to create a release.</div>;
  }

  return (
    <div className="section">
      <div className="container">
        <form onSubmit={handleSubmit}>

          <div className="field">
            <label htmlFor="title" className="label">Release Title</label>
            <div className="control">
              <input
                type="text"
                className="input"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              {errorData.title && (
                <small className="has-text-danger">{errorData.title}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="image" className="label">Image URL</label>
            <div className="control">
              <input
                type="text"
                className="input"
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
              {errorData.image && (
                <small className="has-text-danger">{errorData.image}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="artist" className="label">Artist</label>
            <h3>If Artist is not in the list, please use 'Create Artist'</h3>
            <div className="control">
              <div className="select">
                <select
                  name="artist"
                  value={selectedArtist}
                  onChange={handleArtistChange}
                >
                  <option value="">Select an artist</option>
                  {artists
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(artist => (
                      <option key={artist._id} value={artist._id}>
                        {artist.name}
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>

          {selectedArtist === "new" && (
            <div className="field">
              <label htmlFor="newArtist" className="label">New Artist Name</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  name="artist"
                  value={formData.artist}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {errorData.artist && (
            <small className="has-text-danger">{errorData.artist}</small>
          )}

          <div className="field">
            <label htmlFor="year" className="label">Year</label>
            <div className="control">
              <input
                type="number"
                className="input"
                name="year"
                value={formData.year}
                onChange={handleChange}
              />
              {errorData.year && (
                <small className="has-text-danger">{errorData.year}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="genre" className="label">Genre</label>
            <div className="control">
              <input
                type="text"
                className="input"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              />
              {errorData.genre && (
                <small className="has-text-danger">{errorData.genre}</small>
              )}
            </div>
          </div>
          
          <div className="field">
            <label htmlFor="trackList" className="label">Track List</label>
            <div className="control">
              <textarea
                className="textarea"
                name="trackList"
                value={formData.trackList}
                onChange={handleChange}
                placeholder="Enter track list (one track per line)"
              />
              {errorData.trackList && (
                <small className="has-text-danger">{errorData.trackList}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="releaseType" className="label">Release Type</label>
            <div className="control">
              <div className="select">
                <select
                  name="releaseType"
                  value={formData.releaseType}
                  onChange={handleChange}
                >
                  <option value="Single">Single</option>
                  <option value="Album">Album</option>
                  <option value="EP">EP</option>
                  <option value="Mixtape">Mixtape</option>
                </select>
              </div>
              {errorData.releaseType && (
                <small className="has-text-danger">{errorData.releaseType}</small>
              )}
            </div>
          </div><br/>

          <button className="button is-primary" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRelease;