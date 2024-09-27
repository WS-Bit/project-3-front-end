import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { User, Release, Artist, ProfileUser } from '../../interfaces/types';
import styles from '../../styles/Pagination.module.css';
import { baseUrl } from '../../config';
import FancyLoading from '../FancyLoading';

interface UserProfileProps {
  user: User | null;
}

type SortOption = 'titleAZ' | 'artistAZ' | 'yearDesc' | 'genreAZ';

const UserProfile = ({ user }: UserProfileProps) => {
  const { userId } = useParams<{ userId: string }>();
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [uploads, setUploads] = useState<Release[]>([]);
  const [favourites, setFavourites] = useState<Release[]>([]);
  const [artists, setArtists] = useState<Record<string, Artist>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [releasesPerPage] = useState(15);
  const [sortOption, setSortOption] = useState<SortOption>('titleAZ');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'uploads' | 'favourites'>('uploads');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
    
        if (!token) {
          setError("Unauthorized. Please log in.");
          setLoading(false);
          return;
        }
    
        const [userResponse, uploadsResponse, favouritesResponse] = await Promise.all([
          axios.get<ProfileUser>(`${baseUrl}/user/${userId}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<Release[]>(`${baseUrl}/user/${userId}/uploads`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<Release[]>(`${baseUrl}/user/${userId}/favourites`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setProfileUser(userResponse.data);
        setUploads(uploadsResponse.data);
        setFavourites(favouritesResponse.data);

        const allReleases = [...uploadsResponse.data, ...favouritesResponse.data];
        const artistIds = allReleases
          .map((release) => (typeof release.artist === 'string' ? release.artist : release.artist._id))
          .filter((id, index, self) => self.indexOf(id) === index);

        const artistsResponse = await axios.get<Artist[]>(`${baseUrl}/artists?ids=${artistIds.join(',')}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const artistsMap: Record<string, Artist> = {};
        artistsResponse.data.forEach((artist) => {
          artistsMap[artist._id] = artist;
        });
        setArtists(artistsMap);
    
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data. Please try again later.');
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const filteredAndSortedReleases = useMemo(() => {
    let result = activeTab === 'uploads' ? [...uploads] : [...favourites];

    if (searchTerm) {
      result = result.filter((release) => 
        release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof release.artist === 'string'
          ? artists[release.artist]?.name.toLowerCase().includes(searchTerm.toLowerCase())
          : release.artist.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        release.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case 'titleAZ':
          return a.title.localeCompare(b.title);
        case 'artistAZ':
          return (typeof a.artist === 'string' ? artists[a.artist]?.name : a.artist.name)
            .localeCompare(typeof b.artist === 'string' ? artists[b.artist]?.name : b.artist.name);
        case 'yearDesc':
          return b.year - a.year;
        case 'genreAZ':
          return a.genre.localeCompare(b.genre);
        default:
          return 0;
      }
    });

    return result;
  }, [uploads, favourites, artists, searchTerm, sortOption, activeTab]);

  const indexOfLastRelease = currentPage * releasesPerPage;
  const indexOfFirstRelease = indexOfLastRelease - releasesPerPage;
  const currentReleases = filteredAndSortedReleases.slice(indexOfFirstRelease, indexOfLastRelease);
  const totalPages = Math.ceil(filteredAndSortedReleases.length / releasesPerPage);

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

  if (!profileUser) {
    return <div className="section"><div className="container"><p>User not found.</p></div></div>;
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-2">{profileUser?.user.username ? `${profileUser.user.username}'s Profile` : 'User Profile'}</h1>

        <div className="tabs">
          <ul>
            <li className={activeTab === 'uploads' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('uploads')}>Uploads</a>
            </li>
            <li className={activeTab === 'favourites' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('favourites')}>Favourites</a>
            </li>
          </ul>
        </div>

        <h2 className="title is-4 mt-6">{activeTab === 'uploads' ? 'Uploads' : 'Favourites'}</h2>
        {filteredAndSortedReleases.length > 0 ? (
          <>
            <div className="field is-grouped mb-5">
              <div className="control">
                <div className="select">
                  <select 
                    value={sortOption} 
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                  >
                    <option value="titleAZ">Sort by Title A-Z</option>
                    <option value="artistAZ">Sort by Artist A-Z</option>
                    <option value="yearDesc">Sort by Year (Newest First)</option>
                    <option value="genreAZ">Sort by Genre A-Z</option>
                  </select>
                </div>
              </div>
              <div className="control is-expanded">
                <input
                  className="input"
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="columns is-multiline">
              {currentReleases.map((release: Release) => (
                <div key={release._id} className="column is-half">
                  <div className={`box ${styles.releaseBox}`}>
                    <article className="media">
                      <div className="media-left">
                        <figure className="image is-64x64">
                          <img src={release.image || '/default-album-cover.jpg'} alt={release.title} />
                        </figure>
                      </div>
                      <div className="media-content">
                        <div className="content">
                          <p>
                            <strong>
                              <Link to={`/releases/${release._id}`} className={styles.yellowLink}>
                                {release.title}
                              </Link>
                            </strong>
                            <br />
                            <small>
                              {typeof release.artist === 'string' ? (
                                <Link to={`/artists/${release.artist}`} className={styles.yellowLink}>
                                  {artists[release.artist]?.name || 'Unknown Artist'}
                                </Link>
                              ) : (
                                <Link to={`/artists/${release.artist._id}`} className={styles.yellowLink}>
                                  {release.artist.name || 'Unknown Artist'}
                                </Link>
                              )}
                              {' • '}
                              {release.year} • {release.genre} • {release.releaseType}
                            </small>
                          </p>
                        </div>
                      </div>
                    </article>
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
          </>
        ) : (
          <p>No {activeTab} yet.</p>
        )}
      </div>
    </section>
  );
};

export default UserProfile;