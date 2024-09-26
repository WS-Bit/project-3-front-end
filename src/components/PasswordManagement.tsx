import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import type { AxiosError } from 'axios'; 

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/forgot-password', { email });
      setMessage(response.data.message);
      setIsError(false);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'An error occurred');
      setIsError(true);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-primary" type="submit">
                Send Reset Link
              </button>
            </div>
          </div>
        </form><br/>
        {message && (
          <div className={`notification ${isError ? 'is-danger' : 'is-success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

interface Params {
  resetToken: string;
}

export const ResetPassword = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { resetToken } = useParams<{ resetToken: string }>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      setIsError(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put<{ message: string }>(
        `/api/reset-password/${resetToken}`,
        { password, confirmPassword }
      );

      setMessage(response.data.message);
      setIsError(false);
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    } catch (error: AxiosError | any) {
      if (error && error.response) {
        setMessage(error.response.data.message || 'An error occurred');
      } else {
        setMessage('An unknown error occurred');
      }
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">New Password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Confirm New Password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </form><br/>
        {message && (
          <div className={`notification ${isError ? 'is-danger' : 'is-success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};