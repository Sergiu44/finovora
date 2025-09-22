import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

interface User {
  createdAt: string;
  deletedAt: string | null;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  primaryAccountId: number;
  updatedAt: string;
  verified: boolean;
}

interface UserDetailsContextState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const UserDetailsContext = createContext<UserDetailsContextState>({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
  isAuthenticated: false,
  logout: () => {},
});

export const UserDetailsProvider = (props: PropsWithChildren) => {
  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // Sync with localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        setUserState(e.newValue ? JSON.parse(e.newValue) : null);
      } else if (e.key === "token") {
        setTokenState(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <UserDetailsContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken,
        isAuthenticated: !!token && !!user,
        logout,
      }}
    >
      {props.children}
    </UserDetailsContext.Provider>
  );
};

export const useUserDetails = () => useContext(UserDetailsContext);
