import { useState, useEffect, Dispatch, SetStateAction } from "react";
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

  const fetchUser = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get<User>("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched user in App:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user in App:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login fetchUser={fetchUser} />} />
        <Route path="/releases" element={<ReleaseList />} />
        <Route path="/artists" element={<ArtistsList />} />
        <Route path="/releases/new" element={<CreateRelease user={user} />} />
        <Route path="/artists/new" element={<CreateArtist user={user} />} />
        <Route path="/releases/:releaseId" element={<ShowRelease user={user} />} />
        <Route path="/artists/:artistId" element={<ShowArtist user={user} />} />
        <Route path="/your-page" element={user ? <UserProfile user={user} /> : <div>Loading...</div>} />
        <Route path="/users/:userId" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;