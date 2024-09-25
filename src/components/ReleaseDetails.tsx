import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Release, Artist } from '../interfaces/types';
import styles from './Pagination.module.css';

interface ReleaseDetailsProps {
  release: Release;
  renderTrackList: () => React.ReactNode;
}

function ReleaseDetails({ release, renderTrackList }: ReleaseDetailsProps) {
  const [artist, setArtist] = useState<Artist | null>(null);

  useEffect(() => {
    async function fetchArtist() {
      if (typeof release.artist === 'string') {
        try {
          const response = await axios.get<Artist>(`/api/artists/${release.artist}`);
          setArtist(response.data);
        } catch (error) {
          console.error("Error fetching artist:", error);
        }
      }
    }

    fetchArtist();
  }, [release.artist]);

  return (
    <div className="content">
      <br/>
      <p>
        <strong>Artist:</strong>{' '}
        {artist ? (
          <Link to={`/artists/${artist._id}`} className={styles.yellowLink}>
            {artist.name}
          </Link>
        ) : (
          'Loading artist name...'
        )}
      </p>
      <p><strong>Year:</strong> {release.year}</p>
      <p><strong>Genre:</strong> {release.genre}</p>
      <p><strong>Release Type:</strong> {release.releaseType}</p>
      <p><strong>Added by:</strong> <Link to={`/user/${release.user._id}/profile`} className={styles.yellowLink}>{release.user.username}</Link></p>
      <h2 className="title is-4">Track List</h2>
      {renderTrackList()}<br/>
    </div>
  );
}

export default ReleaseDetails;