import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
  useCallback,
} from "react";
import {
  startProfileSetupSession as startSessionAction,
  validateProfileSetupSession as validateSessionAction,
  type ProfileSetupSessionState,
} from "../utils/actions/users/profileSetupSessions";

export type { ProfileSetupSessionState };

// User type matches the backend User entity (without password)
export interface UserEntity {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  verified: boolean;
  primaryAccountId?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  hasProfile: boolean;
}

interface UserDetailsContextState {
  user: UserEntity | null;
  token: string | null;
  setUser: (user: UserEntity | null) => void;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
  profileSetupSession: ProfileSetupSessionState | null;
  startProfileSetupSession: (options?: { forceNew?: boolean }) => Promise<ProfileSetupSessionState>;
  validateProfileSetupSession: (token: string) => Promise<ProfileSetupSessionState>;
}

const UserDetailsContext = createContext<UserDetailsContextState>({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
  isAuthenticated: false,
  logout: () => {},
  profileSetupSession: null,
  startProfileSetupSession: async () => {
    throw new Error("UserDetailsProvider missing");
  },
  validateProfileSetupSession: async () => {
    throw new Error("UserDetailsProvider missing");
  },
});

export const UserDetailsProvider = (props: PropsWithChildren) => {
  const [user, setUserState] = useState<UserEntity | null>(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    const parsed = JSON.parse(storedUser);
    // Ensure hasProfile field exists (for backward compatibility)
    if (parsed && typeof parsed.hasProfile !== "boolean") {
      parsed.hasProfile = Boolean(parsed.profile);
      // Remove profile field if it exists
      delete parsed.profile;
    }
    return parsed;
  });

  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [profileSetupSession, setProfileSetupSession] =
    useState<ProfileSetupSessionState | null>(null);

  const setUser = (newUser: UserEntity | null) => {
    setUserState(newUser);
    if (newUser) {
      // Ensure we only store UserEntity structure (no profile details)
      const userToStore: UserEntity = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        verified: newUser.verified,
        primaryAccountId: newUser.primaryAccountId,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        deletedAt: newUser.deletedAt,
        hasProfile: newUser.hasProfile,
      };
      localStorage.setItem("user", JSON.stringify(userToStore));
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

  const startProfileSetupSession = useCallback(
    async (options?: { forceNew?: boolean }) => {
      const payload = await startSessionAction(options);
      setProfileSetupSession(payload);
      return payload;
    },
    []
  );

  const validateProfileSetupSession = useCallback(
    async (token: string) => {
      const payload = await validateSessionAction(token);
      setProfileSetupSession(payload);
      return payload;
    },
    []
  );

  // Sync with localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        const parsed = e.newValue ? JSON.parse(e.newValue) : null;
        // Ensure hasProfile field exists (for backward compatibility)
        if (parsed && typeof parsed.hasProfile !== "boolean") {
          parsed.hasProfile = Boolean(parsed.profile);
          delete parsed.profile;
        }
        setUserState(parsed);
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
        profileSetupSession,
        startProfileSetupSession,
        validateProfileSetupSession,
      }}
    >
      {props.children}
    </UserDetailsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserDetails = () => useContext(UserDetailsContext);
