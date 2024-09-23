import React, { useState, useEffect } from 'react';
import { Release, Artist } from '../interfaces/types';
import axios from 'axios';
import ReleaseCard from './ReleaseCard';

function ReleasesList() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const releasesResponse = await axios.get<Release[]>('/api/releases');
        setReleases(releasesResponse.data);

        const artistsResponse = await axios.get<Artist[]>('/api/artists');
        setArtists(artistsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-multiline">
          {releases.map((release) => (
            <div key={release._id} className="column is-one-quarter">
              <ReleaseCard release={release} artists={artists} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ReleasesList;