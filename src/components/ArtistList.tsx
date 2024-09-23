import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Artist } from '../interfaces/types';
import ArtistCard from './ArtistCard';

function ArtistsList() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtists() {
      try {
        const response = await axios.get<Artist[]>('/api/artists');
        setArtists(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching artists:', err);
        setError('Failed to fetch artists. Please try again later.');
        setLoading(false);
      }
    }

    fetchArtists();
  }, []);

  if (loading) {
    return <div className="section"><div className="container"><p>Loading artists...</p></div></div>;
  }

  if (error) {
    return <div className="section"><div className="container"><p className="has-text-danger">{error}</p></div></div>;
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-2 mb-6">All Artists</h1>
        <div className="columns is-multiline">
          {artists.map((artist) => (
            <div key={artist._id} className="column is-one-quarter-desktop is-half-tablet">
              <Link to={`/artists/${artist._id}`}>
                <ArtistCard artist={artist} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArtistsList;