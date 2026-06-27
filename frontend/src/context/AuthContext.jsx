import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [role, setRole]   = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const u     = localStorage.getItem('user');
    const r     = localStorage.getItem('role');

    let parsedUser = null;

    try {
      if (u && u !== "undefined") {
        parsedUser = JSON.parse(u);
      }
    } catch (err) {
      console.error("Error parsing user:", err);
      localStorage.removeItem("user"); // clean corrupted data
    }

    if (token && parsedUser) {
      setUser(parsedUser);
      setRole(r);
    }

    setReady(true);
  }, []);

  const login = (token, userData, userRole) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData)); // ✅ always stringify
    localStorage.setItem('role', userRole);

    setUser(userData);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);