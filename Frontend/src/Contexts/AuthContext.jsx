import React, { createContext, useContext, useEffect, useReducer } from 'react';

const AuthContext = createContext();

const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user')) || {},
};

function reducer(state, { type, payload }) {
  switch (type) {
    case "LOGIN":
      return { isAuthenticated: true, user: payload.user };
    case "LOGOUT":
      return { isAuthenticated: false, user: {} };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "LOGIN", payload: { user } });

    if (user.role === "admin") {
      window.location.href = "/dashboard"; // Admin
    } else {
      window.location.href = "/"; // Regular user
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    window.toastify("Logged out successfully", "success");


  };

  useEffect(() => {
    // Auto-logout if token expires logic could go here
  }, []);

  const token = localStorage.getItem('token');

  return (
    <AuthContext.Provider value={{ ...state, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
