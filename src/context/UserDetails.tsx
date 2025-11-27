import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
  useCallback,
} from "react";
import { createEnhancedAxios } from "../configs/axios";

type ThemePreference = "light" | "dark" | "system";

interface UserProfile {
  id: number;
  userId: number;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  dateOfBirth?: string | null;
  statusMessage?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  preferredStartDayOfMonth: number;
  themePreference: ThemePreference;
  language: string;
  timezone?: string | null;
  preferredCurrency?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export type ProfileSetupSessionStatus = "active" | "completed" | "expired";

export interface ProfileSetupSessionState {
  id: number;
  userId: number;
  token: string;
  status: ProfileSetupSessionStatus;
  expiresAt: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  path: string;
  url: string;
  resumed: boolean;
}

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
  profile: UserProfile | null;
}

interface UserDetailsContextState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
  profileSetupSession: ProfileSetupSessionState | null;
  startProfileSetupSession: (options?: { forceNew?: boolean }) => Promise<ProfileSetupSessionState>;
  validateProfileSetupSession: (token: string) => Promise<ProfileSetupSessionState>;
  completeProfileSetupSession: (token: string) => Promise<void>;
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
  completeProfileSetupSession: async () => {
    throw new Error("UserDetailsProvider missing");
  },
});

export const UserDetailsProvider = (props: PropsWithChildren) => {
  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [profileSetupSession, setProfileSetupSession] =
    useState<ProfileSetupSessionState | null>(null);

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

  const mapSessionResponse = useCallback(
    (data: any, resumed: boolean): ProfileSetupSessionState => {
      const { session, path, url } = data;
      return {
        ...session,
        expiresAt: session.expiresAt,
        completedAt: session.completedAt,
        path,
        url,
        resumed,
      };
    },
    []
  );

  const startProfileSetupSession = useCallback(
    async (options?: { forceNew?: boolean }) => {
      const response = await createEnhancedAxios().post(
        `${import.meta.env.VITE_API_URL}/profile-setup-sessions`,
        options ?? {}
      );

      const payload = mapSessionResponse(response.data, response.data.resumed);
      setProfileSetupSession(payload);
      return payload;
    },
    [mapSessionResponse]
  );

  const validateProfileSetupSession = useCallback(
    async (token: string) => {
      const response = await createEnhancedAxios().get(
        `${import.meta.env.VITE_API_URL}/profile-setup-sessions/${token}`
      );
      const payload = mapSessionResponse(response.data, false);
      setProfileSetupSession(payload);
      return payload;
    },
    [mapSessionResponse]
  );

  const completeProfileSetupSession = useCallback(async (token: string) => {
    await createEnhancedAxios().post(
      `${import.meta.env.VITE_API_URL}/profile-setup-sessions/${token}/complete`
    );
    setProfileSetupSession(null);
  }, []);

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
        profileSetupSession,
        startProfileSetupSession,
        validateProfileSetupSession,
        completeProfileSetupSession,
      }}
    >
      {props.children}
    </UserDetailsContext.Provider>
  );
};

export const useUserDetails = () => useContext(UserDetailsContext);
