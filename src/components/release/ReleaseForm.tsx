import React, { useState, useEffect } from "react";
import { Release, Artist } from "../../interfaces/types";
import { Search } from 'lucide-react';

interface ReleaseFormProps {
  artists: Artist[];
  editForm: Partial<Release>;
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleTrackListChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  trackList: string[];
  updateRelease: (e: React.FormEvent) => Promise<void>;
  setIsEditing: (isEditing: boolean) => void;
}

const ReleaseForm: React.FC<ReleaseFormProps> = ({
  artists,
  editForm,
  handleEditChange,
  handleTrackListChange,
  trackList,
  updateRelease,
  setIsEditing,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState(editForm.artist || "");

  useEffect(() => {
    const results = artists.filter(artist =>
      artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArtists(results);
  }, [searchTerm, artists]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSelectedArtist("");
  };

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist._id);
    setSearchTerm(artist.name);
    handleEditChange({
      target: { name: 'artist', value: artist._id }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <form onSubmit={updateRelease}>
      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input className="input" type="text" name="title" value={editForm.title || ""} onChange={handleEditChange} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="artist" className="label">Artist</label>
        <h3>If Artist is not in the list, please use 'Create Artist'</h3>
        <div className="control has-icons-left">
          <input
            type="text"
            className="input"
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
      </div>

      <div className="field">
        <label className="label">Year</label>
        <div className="control">
          <input className="input" type="number" name="year" value={editForm.year || ""} onChange={handleEditChange} />
        </div>
      </div>

      <div className="field">
        <label className="label">Genre</label>
        <div className="control">
          <input className="input" type="text" name="genre" value={editForm.genre || ""} onChange={handleEditChange} />
        </div>
      </div>

      <div className="field">
        <label className="label">Release Type</label>
        <div className="control">
          <div className="select">
            <select name="releaseType" value={editForm.releaseType || ""} onChange={handleEditChange}>
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
          <input className="input" type="text" name="image" value={editForm.image || ""} onChange={handleEditChange} />
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-primary">
            Save Changes
          </button>
        </div>
        <div className="control">
          <button type="button" className="button is-light" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReleaseForm;