import React from 'react';
import { Artist } from '../interfaces/types';

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-image">
        <figure className="image is-square">
          <img src={artist.image} alt={artist.name} style={{ objectFit: 'cover' }} />
        </figure>
      </div>
      <div className="card-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <p className="title is-5 mb-2">{artist.name}</p>
        <div className="content mt-auto">
          <p className="is-size-7 mb-1">Genre: {artist.genre}</p>
          <p className="is-size-7">Country: {artist.country}</p>
        </div>
      </div>
    </div>
  );
}