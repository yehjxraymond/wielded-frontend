"use client";
import { ChatInterface } from "@/components/ChatInterface";
import { FullPageLoader } from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { HomeMarketing } from ".";
import { PublicLayout } from "../PublicLayout";

export const Home = () => {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) return <FullPageLoader />;

  return isLoggedIn ? (
    <ChatInterface />
  ) : (
    <PublicLayout>
      <HomeMarketing />
    </PublicLayout>
  );
};
