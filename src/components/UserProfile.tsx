import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { User, Release, Artist, ProfileUser } from '../interfaces/types';
import styles from './Pagination.module.css'; // Assuming we're using a shared pagination styles file

interface UserProfileProps {
  user: User | null; // logged-in user prop
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const { userId } = useParams<{ userId: string }>();
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [uploads, setUploads] = useState<Release[]>([]);
  const [artists, setArtists] = useState<Record<string, Artist>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [releasesPerPage] = useState(15);

  useEffect(() => {
    const fetchUserAndUploads = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
    
        if (!token) {
          setError("Unauthorized. Please log in.");
          setLoading(false);
          return;
        }
    
        // Fetch user profile
        const userResponse = await axios.get<ProfileUser>(`/api/user/${userId}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileUser(userResponse.data);
    
        // Fetch user uploads
        const uploadsResponse = await axios.get<Release[]>(`/api/user/${userId}/uploads`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUploads(uploadsResponse.data);

        // Fetch artists for the uploads
        const artistIds = uploadsResponse.data
          .map((release) => (typeof release.artist === 'string' ? release.artist : release.artist._id))
          .filter((id, index, self) => self.indexOf(id) === index);

        const artistsResponse = await axios.get<Artist[]>(`/api/artists?ids=${artistIds.join(',')}`, {
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
      fetchUserAndUploads();
    }
  }, [userId]);

  if (loading) {
    return <div className="section"><div className="container"><p>Loading user profile...</p></div></div>;
  }

  if (error) {
    return <div className="section"><div className="container"><p className="has-text-danger">{error}</p></div></div>;
  }

  if (!profileUser) {
    return <div className="section"><div className="container"><p>User not found.</p></div></div>;
  }

  // Pagination logic
  const indexOfLastRelease = currentPage * releasesPerPage;
  const indexOfFirstRelease = indexOfLastRelease - releasesPerPage;
  const currentReleases = uploads.slice(indexOfFirstRelease, indexOfLastRelease);
  const totalPages = Math.ceil(uploads.length / releasesPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-2">{profileUser?.user.username ? `${profileUser.user.username}'s Profile` : 'User Profile'}</h1>

        <h2 className="title is-4 mt-6">Uploads</h2>
        {uploads.length > 0 ? (
          <>
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
                                  {artists[release.artist._id]?.name || 'Unknown Artist'}
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
          </>
        ) : (
          <p>No uploads yet.</p>
        )}
      </div>
    </section>
  );
};

export default UserProfile;