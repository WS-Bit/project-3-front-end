import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Artist } from '../../interfaces/types';
import ArtistCard from './ArtistCard';
import styles from '../../styles/Pagination.module.css';
import FancyLoading from '../FancyLoading';
import { baseUrl } from '../../config';

type SortOption = 'nameAZ' | 'genreAZ';

function ArtistsList() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [artistsPerPage] = useState(12);
  const [sortOption, setSortOption] = useState<SortOption>('nameAZ');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchArtists() {
      try {
        const response = await axios.get<Artist[]>(`${baseUrl}/artists`);
        setArtists(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch artists. Please try again later.');
        setLoading(false);
      }
    }

    fetchArtists();
  }, []);

  const filteredAndSortedArtists = useMemo(() => {
    let result = [...artists];

   
    if (searchTerm) {
      result = result.filter((artist) => 
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (artist.genre && artist.genre.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

   
    result.sort((a, b) => {
      switch (sortOption) {
        case 'nameAZ':
          return a.name.localeCompare(b.name);
        case 'genreAZ':
          return (a.genre || '').localeCompare(b.genre || '');
        default:
          return 0;
      }
    });

    return result;
  }, [artists, searchTerm, sortOption]);

  
  const indexOfLastArtist = currentPage * artistsPerPage;
  const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
  const currentArtists = filteredAndSortedArtists.slice(indexOfFirstArtist, indexOfLastArtist);
  const totalPages = Math.ceil(filteredAndSortedArtists.length / artistsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  if (loading) {
    return <FancyLoading />;
  }

  if (error) {
    return <div className="section"><div className="container"><p className="has-text-danger">{error}</p></div></div>;
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-2 mb-6">All Artists</h1>
        
        <div className="field is-grouped mb-5">
          <div className="control">
            <div className="select">
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value as SortOption)}
              >
                <option value="nameAZ">Sort by Name A-Z</option>
                <option value="genreAZ">Sort by Genre A-Z</option>
              </select>
            </div>
          </div>
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder="Search artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="columns is-multiline">
          {currentArtists.map((artist) => (
            <div key={artist._id} className="column is-one-quarter-desktop is-half-tablet" style={{ display: 'flex' }}>
              <div className={`box ${styles.releaseBox}`} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <Link to={`/artists/${artist._id}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <ArtistCard artist={artist} />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <nav className="pagination is-centered mt-6" role="navigation" aria-label="pagination">
          <button
            className={`pagination-previous ${styles.yellowPagination}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className={`pagination-next ${styles.yellowPagination}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <ul className="pagination-list">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  className={`pagination-link ${styles.yellowPagination} ${
                    currentPage === page ? styles.isCurrent : ''
                  }`}
                  aria-label={`Go to page ${page}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

export default ArtistsList;