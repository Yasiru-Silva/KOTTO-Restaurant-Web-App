import { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext();

// Hook to use context easily
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user object: { email, role, name, token }

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("kottoUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("kottoUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("kottoUser");
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData); // userData must include { role, token, name, email }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};