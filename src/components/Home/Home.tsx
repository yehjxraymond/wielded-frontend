"use client";
import { HeaderPublic } from "@/components/HeaderPublic";
import { HomeHero } from "@/components/Home/HomeHero";
import { useAuth } from "@/context/AuthContext";
import { ChatInterface } from "@/components/ChatInterface";

const HomeNotLoggedIn = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Hack for both component to fill entire screen */}
      <HeaderPublic />
      <HomeHero />
    </div>
  );
};
export const Home = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <ChatInterface /> : <HomeNotLoggedIn />;
};
