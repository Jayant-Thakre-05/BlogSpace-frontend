import { useForm } from 'react-hook-form';
import { login as loginAPI } from '../api/authAPI';
import useAuth from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { login, saveToken } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const { data } = await loginAPI(values);
      login({ user: data?.user || null, token: null });
      saveToken('cookie');
      toast.success('Logged in successfully');
      navigate('/');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-side">
          <div className="brand-mark">
            <img src="/image.png" alt="BlogSpace" style={{height:28,width:28,objectFit:'contain'}} />
            <span>BlogSpace</span>
          </div>
          <h2>Welcome back</h2>
          <p>Sign in to continue your story.</p>
        </div>
        <div className="auth-form">
          <h1 className="title">Sign in</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="input-group">
              <input className="input-field" placeholder="Email" type="email" {...register('email', { required: true })} />
              <label className="input-label">Email</label>
            </div>
            <div className="input-group">
              <input className="input-field" placeholder="Password" type="password" {...register('password', { required: true })} />
              <label className="input-label">Password</label>
            </div>
            <button disabled={submitting} className="btn btn-primary" type="submit">{submitting ? 'Logging in…' : 'Login'}</button>
          </form>
          <p className="auth-switch muted">Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}
