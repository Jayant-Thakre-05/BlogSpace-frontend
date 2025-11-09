import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) => `navlink${isActive ? ' active' : ''}`;

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="brand">
            <img src="/image.png" alt="BlogSpace logo" />
            <span className='blogspace'>BlogSpace</span>
          </Link>
          <div className="navlinks">
            <NavLink to="/" className={linkClass}></NavLink>
            {token ? (
              <>
                <NavLink to="/create" className={linkClass}>Create Post</NavLink>
                <NavLink to={`/user/${user?._id}`} className={linkClass}>Profile</NavLink>
                <button onClick={handleLogout} className="btn">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>Login</NavLink>
                <NavLink to="/register" className={linkClass}>Register</NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
