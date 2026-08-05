/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_profile');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [jwt, setJwt] = useState(localStorage.getItem('jwt_token') || null);
  const [loading, setLoading] = useState(!!auth);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async () => {
      // We bypass the explicit clearing of localStorage here. 
      // When bypassing Firebase, `firebaseUser` is always null on mount, 
      // which was incorrectly triggering the immediate destruction of the active JWT session.
      setLoading(false);
    });

    const handleForceLogout = () => {
      logoutAuth();
      toast.error('Session expired. Please log in again.');
    };

    window.addEventListener('auth_logout_required', handleForceLogout);

    return () => {
      unsubscribe();
      window.removeEventListener('auth_logout_required', handleForceLogout);
    };
  }, []);

  const loginAuth = (token, userData) => {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_profile', JSON.stringify(userData));
    setJwt(token);
    setUser(userData);
    window.dispatchEvent(new Event("auth_login"));
  };

  const logoutAuth = async () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_profile');
    setJwt(null);
    setUser(null);
    try {
        if (auth) {
            await signOut(auth);
        }
    } catch(err) {
        console.error("Error signing out of firebase", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, jwt, loginAuth, logoutAuth, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
