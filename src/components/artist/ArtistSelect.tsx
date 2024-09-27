import React, { useState, useEffect } from 'react';
import { Artist } from '../../interfaces/types';

interface ArtistSelectProps {
  artists: Artist[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function ArtistSelect({ artists, value, onChange }: ArtistSelectProps) {
  const [selectedArtist, setSelectedArtist] = useState(value);

  useEffect(() => {
    setSelectedArtist(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArtist(e.target.value);
    onChange(e);
  };


  return (
    <div className="field">
      <label className="label">Artist</label>
      <div className="control">
        <div className="select">
          <select
            name="artist"
            value={selectedArtist}
            onChange={handleChange}
          >
            <option value="">Select an artist</option>
            {artists.map((artist) => (
              <option key={artist._id} value={artist._id}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ArtistSelect;