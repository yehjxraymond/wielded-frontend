import { useAuth } from "@/context/AuthContext";

export const ChatInterface = () => {
  const { logout } = useAuth();
  return (
    <div>
      Logged In
      <div onClick={() => logout()}>Logout</div>
    </div>
  );
};
