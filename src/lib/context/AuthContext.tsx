"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useState,
  useEffect,
} from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  User,
  UserCredential,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";

interface AuthContextType {
  user: User | undefined;
  loading: boolean;
  isAuthenticated: boolean;
  login?: () => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    auth.onAuthStateChanged(function handleAuth(user) {
      if (user) {
        setUser(user);
        setAuthenticated(true);
        router.push("/home");
      } else {
        setUser(undefined);
        setAuthenticated(false);
        router.push("/");
      }
      setLoading(false);
    });
  }, [router]);

  const login = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const data = await signInWithPopup(auth, provider);

    router.push("/home");

    return data;
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        loading: isLoading,
        isAuthenticated: isAuthenticated,
        logout: () => Promise.resolve(),
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
