import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from "../../config";

function EmailConfirmation() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Confirming your email...');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await axios.get(`${baseUrl}/confirm-email/${token}`);
        setMessage(response.data.message);
        setTimeout(() => navigate('/login'), 3000); 
      } catch (error: any) {
        if (error.response && error.response.data) {
          setMessage(error.response.data.message || 'An error occurred during email confirmation.');
        } else {
          setMessage('An unexpected error occurred. Please try again.');
        }
      }
    };

    if (token) {
      confirmEmail();
    } else {
      setMessage('Invalid confirmation link.');
    }
  }, [token, navigate]);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Email Confirmation</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default EmailConfirmation;