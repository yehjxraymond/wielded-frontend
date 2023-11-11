"use client";
import { useAuth } from "@/context/AuthContext";
import { ChatInterface } from "@/components/ChatInterface";
import { HomeMarketing } from ".";

export const Home = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <ChatInterface /> : <HomeMarketing />;
};
