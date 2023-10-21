import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import localForage from "localforage";
import jwtDecode from "jwt-decode";

interface AuthContextProps {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  isLoggedIn: boolean;
  logout: () => void;
}

// initializing the context with undefined
export const AuthContext = createContext<AuthContextProps>({
  token: null,
  setToken: () => {},
  logout: () => {},
  isLoggedIn: false,
});

const isTokenExpired = (token: string) => {
  const decodedToken: { exp: number } = jwtDecode(token);
  const expirationDate = new Date(decodedToken.exp * 1000);
  return expirationDate < new Date();
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);

  // Load the token from the storage on mount
  useEffect(() => {
    localForage.getItem<string>("access_token").then((value) => {
      if (value && !isTokenExpired(value)) {
        setToken(value);
      }
    });
  }, []);

  // Save the token to the storage whenever it changes
  useEffect(() => {
    if (token) {
      localForage.setItem("access_token", token);
    } else {
      localForage.removeItem("access_token");
    }
  }, [token]);

  const isLoggedIn = !!token && !isTokenExpired(token);
  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, setToken, isLoggedIn, logout }}>
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
