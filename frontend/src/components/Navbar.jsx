import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Lelang Online</Link>
          
          <div className="flex space-x-4">
            <Link to="/" className="hover:text-gray-300">Beranda</Link>
            
            {user ? (
              <>
                {user.isAdmin && (
                  <Link to="/admin" className="hover:text-gray-300">Admin</Link>
                )}
                <span className="hover:text-gray-300">
                  Halo, {user.username}
                </span>
                <button 
                  onClick={handleLogout}
                  className="hover:text-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300">Login</Link>
                <Link to="/register" className="hover:text-gray-300">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;