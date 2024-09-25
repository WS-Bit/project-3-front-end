import React, { useState, SyntheticEvent, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"

interface LoginProps {
  fetchUser: () => Promise<void>;
}

function Login({ fetchUser }: LoginProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    try {
      console.log("Attempting login...");
      const response = await axios.post("/api/login", formData);
      console.log("Login successful, setting token...");
      localStorage.setItem("token", response.data.token);
      console.log("Fetching user...");
      await fetchUser();
      console.log("User fetched, navigating to releases...");
      navigate("/releases"); // Navigate immediately after successful login
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  }

  return (
    <div className="section">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email" className="label">
              Email
            </label>
            <div className="control">
              <input
                type="email"
                className="input"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="control">
              <input
                type="password"
                className="input"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {errorMessage && (
              <small className="has-text-danger">{errorMessage}</small>
            )}
          </div><br/>
          <button className="button is-primary" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}


export default Login;