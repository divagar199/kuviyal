import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const userEmail = localStorage.getItem('userEmail');
  const isAdmin = userEmail === "divagar.m.msc.cs@gmail.com";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userEmail');
      localStorage.removeItem('cart');
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navTo = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navTo('/home')}>
            <span className="text-3xl font-extrabold text-blue-700 tracking-tighter">Kuvyal.</span>
          </div>

          <div className="hidden sm:flex items-center space-x-4 sm:space-x-6">
            {isAdmin && (
              <button onClick={() => navTo('/admin')} className="text-sm font-semibold text-gray-600 hover:text-blue-700 px-4 py-2 border rounded-lg transition-all">
                Admin Panel
              </button>
            )}
            <button onClick={() => navTo('/home')} className="text-sm font-semibold text-gray-600 hover:text-blue-700 transition-colors">Store</button>
            <button onClick={() => navTo('/my-books')} className="text-sm font-semibold text-gray-600 hover:text-blue-700 transition-colors">My Library</button>
            <button onClick={() => navTo('/cart')} className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all">Cart</button>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <button onClick={handleLogout} className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors">Log Out</button>
          </div>

          <div className="flex items-center sm:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-blue-700 focus:outline-none p-2">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl z-50">
          <div className="px-4 pt-3 pb-5 space-y-2">
            {isAdmin && <button onClick={() => navTo('/admin')} className="block w-full text-left px-3 py-3 font-semibold text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg">Admin Panel</button>}
            <button onClick={() => navTo('/home')} className="block w-full text-left px-3 py-3 font-semibold text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg">Store</button>
            <button onClick={() => navTo('/my-books')} className="block w-full text-left px-3 py-3 font-semibold text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg">My Library</button>
            <button onClick={() => navTo('/cart')} className="block w-full text-left px-3 py-3 font-bold text-blue-700 bg-blue-50 rounded-lg">Cart</button>
            <button onClick={handleLogout} className="block w-full text-left px-3 py-3 font-semibold text-red-500 hover:bg-red-50 rounded-lg mt-4 border-t">Log Out</button>
          </div>
        </div>
      )}
    </nav>
  );
}