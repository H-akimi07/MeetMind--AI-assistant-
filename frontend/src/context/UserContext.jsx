import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/user";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("meetmind_user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loadingUser, setLoadingUser] = useState(!user);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getProfile();

        setUser(res.data);

        localStorage.setItem("meetmind_user", JSON.stringify(res.data));
      } catch (error) {
        console.error("USER CONTEXT ERROR:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("meetmind_user");
          setUser(null);
        }
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem("meetmind_user", JSON.stringify(updatedUser));
  };

  const updateAvatar = (avatar) => {
    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        avatar,
      };

      localStorage.setItem("meetmind_user", JSON.stringify(updatedUser));

      return updatedUser;
    });
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("meetmind_user");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: updateUser,
        updateAvatar,
        clearUser,
        loadingUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
