import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Release, Artist } from '../interfaces/types';
import ReleaseCard from './ReleaseCard';
import styles from './Pagination.module.css';

type SortOption = 'titleAZ' | 'artistAZ' | 'genreAZ' | 'yearDesc';

function ReleasesList() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [releasesPerPage] = useState(12);
  const [sortOption, setSortOption] = useState<SortOption>('titleAZ');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [releasesResponse, artistsResponse] = await Promise.all([
          axios.get<Release[]>('/api/releases'),
          axios.get<Artist[]>('/api/artists')
        ]);
        setReleases(releasesResponse.data);
        setArtists(artistsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredAndSortedReleases = useMemo(() => {
    let result = [...releases];

    // Filter based on search term
    if (searchTerm) {
      result = result.filter((release) => 
        release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof release.artist === 'string' 
          ? artists.find(a => a._id === release.artist)?.name.toLowerCase().includes(searchTerm.toLowerCase())
          : release.artist.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        release.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort based on selected option
    result.sort((a, b) => {
      switch (sortOption) {
        case 'titleAZ':
          return a.title.localeCompare(b.title);
        case 'artistAZ':
          const aName = typeof a.artist === 'string' 
            ? artists.find(art => art._id === a.artist)?.name || ''
            : a.artist.name;
          const bName = typeof b.artist === 'string'
            ? artists.find(art => art._id === b.artist)?.name || ''
            : b.artist.name;
          return aName.localeCompare(bName);
        case 'genreAZ':
          return a.genre.localeCompare(b.genre);
        case 'yearDesc':
          return b.year - a.year;
        default:
          return 0;
      }
    });

    return result;
  }, [releases, artists, searchTerm, sortOption]);

  // Pagination logic
  const indexOfLastRelease = currentPage * releasesPerPage;
  const indexOfFirstRelease = indexOfLastRelease - releasesPerPage;
  const currentReleases = filteredAndSortedReleases.slice(indexOfFirstRelease, indexOfLastRelease);
  const totalPages = Math.ceil(filteredAndSortedReleases.length / releasesPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div className="section"><div className="container"><p>Loading releases...</p></div></div>;
  }

  if (error) {
    return <div className="section"><div className="container"><p className="has-text-danger">{error}</p></div></div>;
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-2 mb-6">All Releases</h1>
        
        <div className="field is-grouped mb-5">
          <div className="control">
            <div className="select">
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value as SortOption)}
              >
                <option value="titleAZ">Sort by Title A-Z</option>
                <option value="artistAZ">Sort by Artist A-Z</option>
                <option value="genreAZ">Sort by Genre A-Z</option>
                <option value="yearDesc">Sort by Year (Newest First)</option>
              </select>
            </div>
          </div>
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder="Search releases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="columns is-multiline">
          {currentReleases.map((release) => (
            <div key={release._id} className="column is-one-quarter-desktop is-half-tablet" style={{ display: 'flex' }}>
              <div className={`box ${styles.releaseBox}`} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <Link to={`/releases/${release._id}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <ReleaseCard release={release} artists={artists} />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <nav className="pagination is-centered mt-6" role="navigation" aria-label="pagination">
          <button
            className="pagination-previous is-warning"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="pagination-next is-warning"
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
                    currentPage === page ? 'is-current' : ''
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

export default ReleasesList;