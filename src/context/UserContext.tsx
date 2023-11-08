import { MutationStatus, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { config } from "../config";
import { useAuth } from "./AuthContext";

export interface User {
  id: string;
  email: string;
  activeWorkspace: string | null;
}

interface UserOthers {
  state: "idle" | "pending" | "error";
}

export interface UserSuccess extends User {
  state: "success";
}

type UserContextProps = UserOthers | UserSuccess;

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
);

const fetchUser = async (token: string) => {
  const response = await axios.get<User>(`${config.baseUrl}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();

  const fetchUserMutation = useMutation({
    mutationFn: fetchUser,
    mutationKey: ["workspaces", token],
  });

  const memoisedFetch = useMemo(
    () => fetchUserMutation.mutate,
    [fetchUserMutation.mutate]
  );

  useEffect(() => {
    if (token) memoisedFetch(token);
  }, [token, memoisedFetch]);

  const getState = (): UserContextProps => {
    switch (fetchUserMutation.status) {
      case "idle":
        return { state: "idle" };
      case "pending":
        return { state: "pending" };
      case "success":
        const user = fetchUserMutation.data;
        return {
          state: "success",
          ...user,
        };
      case "error":
        return { state: "error" };
    }
  };

  return (
    <UserContext.Provider value={getState()}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
