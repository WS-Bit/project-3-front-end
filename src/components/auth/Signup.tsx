import { useState, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from 'lucide-react';
import { baseUrl } from "../../config";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errorData, setErrorData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  function handleChange(e: SyntheticEvent) {
    const targetElement = e.target as HTMLInputElement;
    const newFormData = {
      ...formData,
      [targetElement.name]: targetElement.value,
    };
    setFormData(newFormData);
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/signup`, formData);
      setSuccessMessage("Sign up successful! Please check your email to confirm your account.");
      setErrorData({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
      setFormData({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
      // setTimeout(() => navigate("/login"), 5000);
    } catch (error: any) {
      console.error("An error occurred during signup:", error);
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrorData(error.response.data.errors);
        } else {
          let errorMessage = "An error occurred during signup. Please try again later.";
          if (error.response.data.message) {
            errorMessage = `Error: ${error.response.data.message}`;
          }
          alert(errorMessage);
        }
      } else {
        console.error("Error details:", error);
        alert("An error occurred during signup. Please try again later.");
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="section">
      <div className="container">
        {successMessage && (
          <div className="notification is-success">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username" className="label">
              Username
            </label>
            <div className="control">
              <input
                type="text"
                className="input"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {errorData.username && (
                <small className="has-text-danger">{errorData.username}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="email" className="label">
              Email
            </label>
            <div className="control">
              <input
                type="text"
                className="input"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errorData.email && (
                <small className="has-text-danger">{errorData.email}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="control has-icons-right">
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <span className="icon is-small is-right" onClick={togglePasswordVisibility} style={{pointerEvents: 'auto', cursor: 'pointer'}}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errorData.password && (
                <small className="has-text-danger">{errorData.password}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="confirmPassword" className="label">
              Password Confirmation
            </label>
            <div className="control has-icons-right">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="input"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span className="icon is-small is-right" onClick={toggleConfirmPasswordVisibility} style={{pointerEvents: 'auto', cursor: 'pointer'}}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errorData.confirmPassword && (
                <small className="has-text-danger">
                  {errorData.confirmPassword}
                </small>
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

export default Signup;