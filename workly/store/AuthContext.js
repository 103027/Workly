import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext({
  userId: null,
  name: null,
  email: null,
  isAuthenticated: false,
  role: null,
  phoneNumber: null,
  afterlogin: (userData) => {},
  logout: () => {},
  setRole: (role) => {}
});

export const useAuth = () => useContext(AuthContext);

export function AuthenticationContextProvider({ children }) {
  const [authState, setAuthState] = useState({
    userId: null,
    name: null,
    email: null,
    isAuthenticated: false,
    role: null,
    phoneNumber: null
  });

  // Initialize from localStorage (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        setAuthState(JSON.parse(storedAuth));
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth', JSON.stringify(authState));
    }
  }, [authState]);

  const afterlogin = (userData) => {
    setAuthState({
      userId: userData.id,
      name: userData.name,
      email: userData.email,
      isAuthenticated: true,
      role: userData.role,
      phoneNumber: userData.phoneNumber
    });
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth');
    }
    setAuthState({
      userId: null,
      name: null,
      email: null,
      isAuthenticated: false,
      role: null,
      phoneNumber: null
    });
  };

  const setRole = (role) => {
    setAuthState(prev => ({ ...prev, role }));
  };

  const value = {
    ...authState,
    afterlogin,
    logout,
    setRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}