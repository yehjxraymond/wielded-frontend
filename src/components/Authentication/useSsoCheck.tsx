"use client";
import { config } from "@/config";
import { useDebounce } from "@uidotdev/usehooks";
import axios from "axios";
import { useEffect, useState } from "react";

type SsoState =
  | {
      state: "pending";
    }
  | { state: "success"; isSsoEnabled: boolean; isSsoEnforced: boolean }
  | { state: "error"; error: string };

export const useSsoCheck = ({ email }: { email: string }) => {
  const debouncedEmail = useDebounce(email, 500);
  const [ssoState, setSsoState] = useState<SsoState>({ state: "pending" });
  const checkSsoStatus = async (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
    if (!emailRegex.test(email)) {
      setSsoState({
        state: "success",
        isSsoEnabled: false,
        isSsoEnforced: false,
      });
      return;
    }

    try {
      setSsoState({ state: "pending" });

      const response = await axios.get(
        `${config.baseUrl}/sso/saml/check-email?email=${email}`
      );
      const { isSsoEnabled, isSsoEnforced } = response.data;

      if (isSsoEnabled && isSsoEnforced) {
        setSsoState({ state: "success", isSsoEnabled, isSsoEnforced });
      } else {
        setSsoState({ state: "success", isSsoEnabled, isSsoEnforced });
      }
    } catch (error) {
      setSsoState({ state: "error", error: (error as Error).message });
      console.error("Error checking SSO status", error);
    }
  };
  useEffect(() => {
    if (debouncedEmail) {
      checkSsoStatus(debouncedEmail);
    }
  }, [debouncedEmail]);

  return ssoState;
};
