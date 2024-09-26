import React, { useState, SyntheticEvent, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Artist } from "../interfaces/types";
import { Search } from 'lucide-react'
import './CreateRelease.css';
import './FormStyles.css';

interface CreateReleaseProps {
  user: User | null;
}

interface FormData {
  title: string;
  image: string;
  artist: string;
  year: string;
  genre: string;
  trackList: string;
  releaseType: string;
  user: string;
}

interface ErrorData {
  title: string;
  image: string;
  artist: string;
  year: string;
  genre: string;
  trackList: string;
  releaseType: string;
  user: string;
}

function CreateRelease({ user }: CreateReleaseProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    image: "",
    artist: "",
    year: "",
    genre: "",
    trackList: "",
    releaseType: "Album",
    user: user?._id || ""
  });

  const [errorData, setErrorData] = useState<ErrorData>({
    title: "",
    image: "",
    artist: "",
    year: "",
    genre: "",
    trackList: "",
    releaseType: "",
    user: ""
  });

  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [formValid, setFormValid] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
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

  useEffect(() => {
    const results = artists.filter(artist =>
      artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArtists(results);
  }, [searchTerm, artists]);

  useEffect(() => {
    validateForm();
  }, [formData, selectedArtist]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSelectedArtist("");
  };

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist._id);
    setSearchTerm(artist.name);
    setFormData(prevData => ({ ...prevData, artist: artist._id }));
  };

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

  function validateForm() {
    const newErrorData: ErrorData = {
      title: "",
      image: "",
      artist: "",
      year: "",
      genre: "",
      trackList: "",
      releaseType: "",
      user: ""
    };
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      if (key !== 'user' && key !== 'image' && !formData[key].trim()) {
        newErrorData[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        isValid = false;
      }
    });

    if (!selectedArtist && !formData.artist) {
      newErrorData.artist = "Artist is required";
      isValid = false;
    }

    setErrorData(newErrorData);
    setFormValid(isValid);
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setAttemptedSubmit(true);
  
    if (!formValid) {
      return;
    }
  
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
      if (error.response && error.response.data && error.response.data.errors) {
        setErrorData(prevErrors => ({ ...prevErrors, ...error.response.data.errors }));
      }
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
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
                className={`input ${attemptedSubmit && errorData.title ? 'is-danger' : ''}`}
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              {attemptedSubmit && errorData.title && (
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
            </div>
          </div>

          <div className="field">
            <label htmlFor="artist" className="label">Artist</label>
            <h3>If Artist is not in the list, please use 'Create Artist'</h3>
            <div className="control has-icons-left">
              <input
                type="text"
                className={`input ${attemptedSubmit && errorData.artist ? 'is-danger' : ''}`}
                placeholder="Search for an artist"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <span className="icon is-small is-left">
                <Search />
              </span>
            </div>
            {searchTerm && !selectedArtist && (
              <div className="search-results">
                {filteredArtists.map(artist => (
                  <div 
                    key={artist._id} 
                    className="search-result-item"
                    onClick={() => handleSelectArtist(artist)}
                  >
                    {artist.name}
                  </div>
                ))}
              </div>
            )}
            {selectedArtist && (
              <div className="selected-artist">
                Selected: {artists.find(a => a._id === selectedArtist)?.name}
              </div>
            )}
            {attemptedSubmit && errorData.artist && (
              <small className="has-text-danger">{errorData.artist}</small>
            )}
          </div>

          <div className="field">
            <label htmlFor="year" className="label">Year</label>
            <div className="control">
              <input
                type="number"
                className={`input ${attemptedSubmit && errorData.year ? 'is-danger' : ''}`}
                name="year"
                value={formData.year}
                onChange={handleChange}
              />
              {attemptedSubmit && errorData.year && (
                <small className="has-text-danger">{errorData.year}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="genre" className="label">Genre</label>
            <div className="control">
              <input
                type="text"
                className={`input ${attemptedSubmit && errorData.genre ? 'is-danger' : ''}`}
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              />
              {attemptedSubmit && errorData.genre && (
                <small className="has-text-danger">{errorData.genre}</small>
              )}
            </div>
          </div>
          
          <div className="field">
            <label htmlFor="trackList" className="label">Track List</label>
            <div className="control">
              <textarea
                className={`textarea ${attemptedSubmit && errorData.trackList ? 'is-danger' : ''}`}
                name="trackList"
                value={formData.trackList}
                onChange={handleChange}
                placeholder="Enter track list (one track per line)"
              />
              {attemptedSubmit && errorData.trackList && (
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
                  className={attemptedSubmit && errorData.releaseType ? 'is-danger' : ''}
                >
                  <option value="Single">Single</option>
                  <option value="Album">Album</option>
                  <option value="EP">EP</option>
                  <option value="Mixtape">Mixtape</option>
                </select>
              </div>
              {attemptedSubmit && errorData.releaseType && (
                <small className="has-text-danger">{errorData.releaseType}</small>
              )}
            </div>
          </div><br/>

          <button className="button is-warning" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRelease;