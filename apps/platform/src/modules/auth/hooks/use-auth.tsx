import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { api, ApiError } from "../../../lib/api-client";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  jobTitle: string | null;
  company: string | null;
  location: string | null;
  plan: "free" | "pro" | "team";
  profileComplete: boolean;
  emailVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  jobTitle: string;
  company: string;
  location: string;
  bio?: string;
}

interface UpdateProfileData {
  name?: string;
  bio?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const LS_KEY = "wc_user";

function readCache(): User | null {
  try {
    const s = localStorage.getItem(LS_KEY);
    return s ? (JSON.parse(s) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readCache);
  const [isLoading, setIsLoading] = useState(true);

  function save(u: User | null) {
    setUser(u);
    if (u) localStorage.setItem(LS_KEY, JSON.stringify(u));
    else localStorage.removeItem(LS_KEY);
  }

  const refetch = useCallback(async () => {
    try {
      const u = await api.get<User>("/api/auth/me");
      save(u);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) save(null);
    }
  }, []);

  useEffect(() => {
    refetch().finally(() => setIsLoading(false));
  }, [refetch]);

  async function login(email: string, password: string) {
    const u = await api.post<User>("/api/auth/login", { email, password });
    save(u);
  }

  async function register(data: RegisterData) {
    const u = await api.post<User>("/api/auth/register", data);
    save(u);
  }

  async function logout() {
    await api.post("/api/auth/logout");
    save(null);
  }

  async function updateProfile(data: UpdateProfileData) {
    const u = await api.patch<User>("/api/auth/me", data);
    save(u);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout, updateProfile, refetch }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
