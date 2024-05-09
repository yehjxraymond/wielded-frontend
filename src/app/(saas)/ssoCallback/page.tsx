"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SsoCallback() {
  const { setToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const { hash } = window.location;
    const token = hash.slice(1);
    if (token) {
      setToken(token);
      router.replace("/");
    }
  }, [router, setToken]); // Add router to the dependency array

  return <main></main>;
}
