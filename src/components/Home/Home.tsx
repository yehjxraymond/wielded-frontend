"use client";
import { ChatInterface } from "@/components/ChatInterface";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { HomeMarketing } from ".";

const FullPageLoader = () => {
  return (
    <div className="flex flex-col bg-primary-foreground gap-y-2 justify-center items-center h-screen w-screen top-0 left-0 z-50 fixed">
      <div>
        <Loader className="text-primary animate-spin" size={48} />
      </div>
      <div>Loading...</div>
    </div>
  );
};

export const Home = () => {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) return <FullPageLoader />;

  return isLoggedIn ? <ChatInterface /> : <HomeMarketing />;
};
