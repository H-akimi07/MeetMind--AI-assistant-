import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/user";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        setLoadingUser(false);
        return;
      }

      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (error) {
        console.error("USER CONTEXT ERROR:", error);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  const updateUser = (updatedUser) => {
    setUser((prev) => ({
      ...prev,
      ...updatedUser,
    }));
  };

  const updateAvatar = (avatar) => {
    setUser((prev) => ({
      ...prev,
      avatar,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loadingUser,
        updateUser,
        updateAvatar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
}
