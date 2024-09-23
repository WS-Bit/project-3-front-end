import React from 'react';
import { Release, Artist } from '../interfaces/types';
import { Link } from 'react-router-dom';

interface ReleaseCardProps {
  release: Release;
  artists: Artist[];
}

export default function ReleaseCard({ release, artists }: ReleaseCardProps) {
  const artist = artists.find((a) => a._id === release.artist);
  return (
    <Link to={`/releases/${release._id}`} className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-image">
        <figure className="image is-square">
          <img src={release.image} alt={release.title} style={{ objectFit: 'cover' }} />
        </figure>
      </div>
      <div className="card-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <p className="title is-5 mb-2">{release.title}</p>
        <p className="subtitle is-6 mb-2">{artist?.name || 'Unknown Artist'}</p>
        <div className="content mt-auto">
          <p className="is-size-7 mb-1">{release.year} - {release.genre}</p>
          <p className="is-size-7">{release.releaseType}</p>
        </div>
      </div>
    </Link>
  );
}