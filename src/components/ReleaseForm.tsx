import React from "react";
import { Release, Artist } from "../interfaces/types";
import ArtistSelect from "./ArtistSelect";

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
  return (
    <form onSubmit={updateRelease}>
      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input className="input" type="text" name="title" value={editForm.title || ""} onChange={handleEditChange} />
        </div>
      </div>

      <ArtistSelect artists={artists} value={(editForm.artist as Artist)?._id || ""} onChange={handleEditChange} />

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