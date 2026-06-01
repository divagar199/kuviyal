import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navTo = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" onClick={() => navTo('/home')}>
            <span className="text-3xl font-black text-slate-900 tracking-tighter transition-all group-hover:text-blue-600">
              Kuviyal<span className="text-blue-600 font-serif">.</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-8">
            <button 
              onClick={() => navTo('/home')} 
              className={`text-sm font-bold tracking-wide transition-colors relative py-2 cursor-pointer ${
                isActive('/home') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Store
              {isActive('/home') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
              )}
            </button>
            <button 
              onClick={() => navTo('/my-books')} 
              className={`text-sm font-bold tracking-wide transition-colors relative py-2 cursor-pointer ${
                isActive('/my-books') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              My Library
              {isActive('/my-books') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
              )}
            </button>
            
            <button 
              onClick={() => navTo('/cart')} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold shadow-sm hover:shadow transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                isActive('/cart') 
                  ? 'bg-blue-600 text-white shadow-blue-500/10' 
                  : 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-900/10'
              }`}
            >
              Cart
            </button>

            {isAdmin && (
              <button 
                onClick={() => navTo('/admin')} 
                className={`text-sm font-bold px-4 py-2.5 border rounded-xl transition-all hover:bg-slate-50 cursor-pointer ${
                  isActive('/admin') 
                    ? 'border-blue-600 text-blue-600 font-extrabold bg-blue-50/50' 
                    : 'border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600'
                }`}
              >
                Admin Panel
              </button>
            )}
            
            <div className="h-6 w-px bg-slate-200"></div>
            
            <button 
              onClick={handleLogout} 
              className="text-sm font-bold text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-slate-600 hover:text-blue-600 focus:outline-none p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (with slide-down animation) */}
      {isOpen && (
        <div className="sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 absolute w-full left-0 shadow-2xl z-50 animate-fade-in">
          <div className="px-4 pt-3 pb-6 space-y-2">
            <button 
              onClick={() => navTo('/home')} 
              className={`block w-full text-left px-4 py-3.5 font-bold rounded-xl transition-all cursor-pointer ${
                isActive('/home') ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Store
            </button>
            <button 
              onClick={() => navTo('/my-books')} 
              className={`block w-full text-left px-4 py-3.5 font-bold rounded-xl transition-all cursor-pointer ${
                isActive('/my-books') ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              My Library
            </button>
            <button 
              onClick={() => navTo('/cart')} 
              className={`block w-full text-left px-4 py-3.5 font-extrabold rounded-xl transition-all cursor-pointer ${
                isActive('/cart') ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Cart
            </button>
            {isAdmin && (
              <button 
                onClick={() => navTo('/admin')} 
                className={`block w-full text-left px-4 py-3.5 font-bold rounded-xl transition-all cursor-pointer ${
                  isActive('/admin') ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                Admin Panel
              </button>
            )}
            <div className="border-t border-slate-100 my-4 pt-4">
              <button 
                onClick={handleLogout} 
                className="block w-full text-left px-4 py-3.5 font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}