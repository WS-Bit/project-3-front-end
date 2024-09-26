import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ReleaseList from "./components/ReleaseList";
import ArtistsList from "./components/ArtistList";
import ShowRelease from "./components/ShowRelease";
import ShowArtist from "./components/ShowArtist";
import Signup from "./components/Signup";
import Login from "./components/Login";
import CreateRelease from "./components/CreateRelease";
import CreateArtist from "./components/CreateArtist";
import UserProfile from "./components/UserProfile";
import { ResetPassword, ForgotPassword } from "./components/PasswordManagement";

import { Release } from "./interfaces/types";

export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  uploads?: Release[];
  favorites?: Release[];
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);

  const fetchUser = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      setKey(prevKey => prevKey + 1);
      return;
    }
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get<User>("/api/user");
      setUser(response.data);
      setKey(prevKey => prevKey + 1);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common['Authorization'];
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div key={key}>
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login fetchUser={fetchUser} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
          <Route path="/releases" element={<ReleaseList />} />
          <Route path="/artists" element={<ArtistsList />} />
          <Route path="/releases/new" element={<CreateRelease user={user} />} />
          <Route path="/artists/new" element={<CreateArtist user={user} />} />
          <Route path="/releases/:releaseId" element={<ShowRelease user={user} />} />
          <Route path="/artists/:artistId" element={<ShowArtist user={user} />} />
          <Route path="/profile" element={user ? <UserProfile user={user} /> : <div>Loading...</div>} />
          <Route path="/user/:userId/profile" element={<UserProfile user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;