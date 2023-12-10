import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useEffect, useMemo } from "react";

// Remove flag below to enable the welcome modal
const IS_DISABLED = true;

const fetchIntroductionPreference = async ({ token }: { token: string }) => {
  const response = await axios.get<{ value: "true" | "false" }>(
    `${config.baseUrl}/user/preference/introduction`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const updateIntroductionPreference = async ({ token }: { token: string }) => {
  await axios.put(
    `${config.baseUrl}/user/preference/introduction`,
    {
      value: "true",
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const useIntroduction = () => {
  const { token } = useAuth();

  const fetchIntroductionMutation = useMutation({
    mutationFn: fetchIntroductionPreference,
  });
  const updateIntroductionMutation = useMutation({
    mutationFn: updateIntroductionPreference,
    onSuccess: () => {
      // If the update was successful, refetch the preference to get the updated value.
      fetchIntroductionMutation.mutate();
    },
  });
  const memoisedFetchIntroduction = useMemo(
    () => fetchIntroductionMutation.mutate,
    [fetchIntroductionMutation.mutate]
  );
  useEffect(() => {
    if (token && !IS_DISABLED) memoisedFetchIntroduction({ token });
  }, [token, memoisedFetchIntroduction]);

  // Helper to manually trigger refetching introduction preference
  const refetchIntroduction = () => {
    if (token) fetchIntroductionMutation.mutate({ token });
  };

  // Function to dismiss introduction (update preference to "true")
  const dismissIntroduction = () => {
    if (token) updateIntroductionMutation.mutate({ token });
  };

  // Should show introduction only if it's the first visit (error) or the preference is "false"
  const shouldShowIntroduction =
    fetchIntroductionMutation.isError ||
    (fetchIntroductionMutation.isSuccess &&
      fetchIntroductionMutation.data?.value === "false");

  return {
    // Data and state from fetch mutation
    introductionData: fetchIntroductionMutation.data,
    isLoadingIntroduction: fetchIntroductionMutation.isPending,
    introductionError: fetchIntroductionMutation.error,
    refetchIntroduction,

    // State and function from update mutation
    isUpdatingIntroduction: updateIntroductionMutation.isPending,
    updateIntroductionError:
      updateIntroductionMutation.error as AxiosError | null,
    dismissIntroduction,

    // Helper to determine whether to show the dialog
    shouldShowIntroduction,
  };
};
