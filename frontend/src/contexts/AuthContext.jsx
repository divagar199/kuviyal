import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        localStorage.setItem('userEmail', user.email);
      } else {
        localStorage.removeItem('userEmail');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('cart');
  };

  const isAdmin = currentUser?.email === "divagar.m.msc.cs@gmail.com" || localStorage.getItem('userEmail') === "divagar.m.msc.cs@gmail.com";

  const value = {
    currentUser,
    loading,
    userEmail: currentUser?.email || localStorage.getItem('userEmail'),
    isAdmin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
