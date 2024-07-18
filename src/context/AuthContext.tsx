import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import localForage from "localforage";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  isLoggedIn: boolean;
  logout: () => void;
  isLoading: boolean;
}

// initializing the context with undefined
export const AuthContext = createContext<AuthContextProps>({
  token: null,
  setToken: () => {},
  logout: () => {},
  isLoggedIn: false,
  isLoading: true,
});

const isTokenExpired = (token: string) => {
  const decodedToken: { exp: number } = jwtDecode(token);
  const expirationDate = new Date(decodedToken.exp * 1000);
  return expirationDate < new Date();
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { push } = useRouter();
  const [token, setTokenLocal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load the token from the storage on mount
  useEffect(() => {
    localForage.getItem<string>("access_token").then((value) => {
      if (value && !isTokenExpired(value)) {
        setToken(value);
      }
      setIsLoading(false);
    });
  }, []);

  // Save the token to the storage whenever it changes
  const setToken = (token: string | null) => {
    setTokenLocal(token);
    if (token) {
      localForage.setItem("access_token", token);
    } else {
      localForage.removeItem("access_token");
    }
  };

  const isLoggedIn = !!token && !isTokenExpired(token);
  const logout = () => {
    setToken(null);
    push("/");
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, isLoggedIn, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Helper hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
