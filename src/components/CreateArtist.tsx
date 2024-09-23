import React, { useState, SyntheticEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "../interfaces/types";

interface CreateArtistProps {
  user: User | null;
}

function CreateArtist({ user }: CreateArtistProps) {
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    image: "",
    country: "",
    formedYear: "",
    biography: "",
    user: user?._id || ""
  });

  const [errorData, setErrorData] = useState({
    name: "",
    genre: "",
    image: "",
    country: "",
    formedYear: "",
    biography: "",
    user: user?._id || ""
  });
  const navigate = useNavigate();
  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/artists",
        {
          ...formData,
          user: user?._id // Include the user ID in the request data
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("RESPONSE IS: ", response);
  
      navigate("/artists");
    } catch (error: any) {
      console.log("THE ERROR IS: ", error);
      setErrorData(error.response.data.errors || {});
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
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
                className="input"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errorData.name && (
                <small className="has-text-danger">{errorData.name}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="genre" className="label">Genre</label>
            <div className="control">
              <input
                type="text"
                className="input"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              />
              {errorData.genre && (
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
              {errorData.image && (
                <small className="has-text-danger">{errorData.image}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="country" className="label">Country</label>
            <div className="control">
            <input
                type="text"
                className="input"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
              {errorData.country && (
                <small className="has-text-danger">{errorData.country}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="formedYear" className="label">Formed Year</label>
            <div className="control">
              <input
                type="text"
                className="input"
                name="formedYear"
                value={formData.formedYear}
                onChange={handleChange}
              />
              {errorData.formedYear && (
                <small className="has-text-danger">{errorData.formedYear}</small>
              )}
            </div>
          </div>
          
          <div className="field">
            <label htmlFor="biography" className="label">Biography</label>
            <div className="control">
              <textarea
                className="textarea"
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                placeholder="Enter biography"
              />
              {errorData.biography && (
                <small className="has-text-danger">{errorData.biography}</small>
              )}
            </div>
          </div><br/>

          <button className="button is-primary" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateArtist;