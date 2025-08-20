import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {}, []);

  const login = async (data) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}/signin`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUser(response.data);
      return response;
    } catch (error) {
      setError(error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}/signup`
      );
      setUser(response.data);
    } catch (error) {
      setError(error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loading, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
