import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { User } from '../App'; // Adjust the import path as needed

interface UserProfileProps {
  user?: User | null;
}

function UserProfile({ user: propUser }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useParams<{ userId?: string }>();

  console.log('UserProfile render - propUser:', propUser, 'userId:', userId);

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log('Fetching user profile - propUser:', propUser, 'userId:', userId);
      setLoading(true);
      try {
        let response;
        if (userId) {
          console.log('Fetching user by userId:', userId);
          response = await axios.get<User>(`/api/users/${userId}`);
        } else if (propUser && propUser._id) {
          console.log('Fetching user by propUser._id:', propUser._id);
          response = await axios.get<User>(`/api/users/${propUser._id}`);
        } else if (propUser) {
          console.log('Using propUser directly:', propUser);
          setUser(propUser);
          setLoading(false);
          return;
        } else {
          throw new Error('No user ID available');
        }
        console.log('Profile fetched successfully:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (axios.isAxiosError(error)) {
          console.error('Axios error details:', error.response?.data, error.response?.status, error.response?.headers);
        }
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, propUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">{user.username}'s Profile</h1>
        <h2 className="subtitle">Uploads</h2>
        {user.uploads && user.uploads.length > 0 ? (
          user.uploads.map(release => (
            <div key={release._id} className="box">
              <h3 className="title is-5">{release.title}</h3>
              <p>Year: {release.year}</p>
              <p>Genre: {release.genre}</p>
            </div>
          ))
        ) : (
          <p>No uploads yet.</p>
        )}
        <h2 className="subtitle">Favorites</h2>
        {user.favorites && user.favorites.length > 0 ? (
          user.favorites.map(release => (
            <div key={release._id} className="box">
              <h3 className="title is-5">{release.title}</h3>
              <p>Year: {release.year}</p>
              <p>Genre: {release.genre}</p>
            </div>
          ))
        ) : (
          <p>No favorites yet.</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;