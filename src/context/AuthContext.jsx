// import axios from "axios";
// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMe = async () => {
//       setLoading(true)
//       const response = await axios.get(`${import.meta.env.VITE_API_URI}/me`, {
//         withCredentials: true,
//       });
//       response.data.message = "User Authenticated Successfully";
//       setUser(response.data);
//     };
//     fetchMe();
//   }, []);

//   const login = async (data) => {
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URI}/signin`,
//         data,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       setUser(response.data);
//       return response;
//     } catch (error) {
//       setError(error.message);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signup = async (data) => {
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URI}/signup`
//       );
//       setUser(response.data);
//     } catch (error) {
//       setError(error.message);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, loading, signup }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // start as loading until we check session
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URI;

  /**
   * Fetch the logged-in user (session check)
   */
  const fetchMe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/me`, {
        withCredentials: true,
      });

      setUser(response.data); // store user data
      setError(null);
    } catch (err) {
      console.error("fetchMe error:", err);
      setUser(null);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchMe(); // run on mount
  }, [fetchMe]);

  /**
   * Login user
   */
  const login = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/signin`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setUser(response.data);
      await fetchMe(); // refresh user state after login
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signup user
   */
  const signup = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/signup`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setUser(response.data);
      await fetchMe(); // refresh user state after signup
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
