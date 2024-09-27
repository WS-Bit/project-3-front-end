import React, { useState, SyntheticEvent, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "../interfaces/types";
import { baseUrl } from "../config";
import './FormStyles.css';

interface CreateArtistProps {
  user: User | null;
}

interface FormData {
  name: string;
  genre: string;
  image: string;
  country: string;
  formedYear: string;
  biography: string;
  user: string;
}

interface ErrorData {
  name: string;
  genre: string;
  image: string;
  country: string;
  formedYear: string;
  biography: string;
  user: string;
}

function CreateArtist({ user }: CreateArtistProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    genre: "",
    image: "",
    country: "",
    formedYear: "",
    biography: "",
    user: user?._id || ""
  });

  const [errorData, setErrorData] = useState<ErrorData>({
    name: "",
    genre: "",
    image: "",
    country: "",
    formedYear: "",
    biography: "",
    user: ""
  });

  const [nameExists, setNameExists] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.name) {
      checkArtistName(formData.name);
    }
    validateForm();
  }, [formData]);

  async function checkArtistName(name: string) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}/artists/check-name/${name}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNameExists(response.data.exists);
    } catch (error) {
      console.error("Error checking artist name:", error);
    }
  }

  function validateForm() {
    const newErrorData: ErrorData = {
      name: "",
      genre: "",
      image: "",
      country: "",
      formedYear: "",
      biography: "",
      user: ""
    };
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      if (key !== 'user' && key !== 'image' && !formData[key].trim()) {
        newErrorData[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        isValid = false;
      }
    });

    setErrorData(newErrorData);
    setFormValid(isValid && !nameExists);
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setAttemptedSubmit(true);
  
    if (!formValid) {
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseUrl}/artists`,
        {
          ...formData,
          user: user?._id 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      navigate("/artists");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrorData(prevErrors => ({ ...prevErrors, ...error.response.data.errors }));
      }
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    if (name === 'name') {
      setNameExists(false);
    }
  }

  if (!user) {
    return <div>Please log in to create an artist.</div>;
  }

  return (
    <div className="section">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name" className="label">Name</label>
            <div className="control">
              <input
                type="text"
                className={`input ${attemptedSubmit && (errorData.name || nameExists) ? 'is-danger' : ''}`}
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {attemptedSubmit && (errorData.name || nameExists) && (
                <small className="has-text-danger">
                  {errorData.name || "An artist with this name already exists"}
                </small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="genre" className="label">Genre</label>
            <div className="control">
              <input
                type="text"
                className={`input ${attemptedSubmit && errorData.genre ? 'is-danger' : ''}`}
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              />
              {attemptedSubmit && errorData.genre && (
                <small className="has-text-danger">{errorData.genre}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="image" className="label">Image URL</label>
            <div className="control">
              <input
                type="text"
                className="input"
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="country" className="label">Country</label>
            <div className="control">
            <input
                type="text"
                className={`input ${attemptedSubmit && errorData.country ? 'is-danger' : ''}`}
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
              {attemptedSubmit && errorData.country && (
                <small className="has-text-danger">{errorData.country}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="formedYear" className="label">Formed Year</label>
            <div className="control">
              <input
                type="text"
                className={`input ${attemptedSubmit && errorData.formedYear ? 'is-danger' : ''}`}
                name="formedYear"
                value={formData.formedYear}
                onChange={handleChange}
              />
              {attemptedSubmit && errorData.formedYear && (
                <small className="has-text-danger">{errorData.formedYear}</small>
              )}
            </div>
          </div>
          
          <div className="field">
            <label htmlFor="biography" className="label">Biography</label>
            <div className="control">
              <textarea
                className={`textarea ${attemptedSubmit && errorData.biography ? 'is-danger' : ''}`}
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                placeholder="Enter biography"
              />
              {attemptedSubmit && errorData.biography && (
                <small className="has-text-danger">{errorData.biography}</small>
              )}
            </div>
          </div><br/>

          <button className="button is-warning" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateArtist;