
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ppn_token');
    if (token) {
      const userData = JSON.parse(localStorage.getItem('ppn_user'));
      

      if (userData && !userData.role) {
        userData.role = userData.is_admin ? 'admin' : 'user';
        localStorage.setItem('ppn_user', JSON.stringify(userData));
      }
      
      setCurrentUser(userData);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    // S'assurer que le champ role existe
    if (!userData.role) {
      userData.role = userData.is_admin ? 'admin' : 'user';
    }
    
    localStorage.setItem('ppn_token', token);
    localStorage.setItem('ppn_user', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ppn_token');
    localStorage.removeItem('ppn_user');
    setCurrentUser(null);
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      isAdmin, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
