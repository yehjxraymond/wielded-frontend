import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo } from "react";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "unpaid"
  | "initializing";
export type SubscriptionTier = "free" | "team";
export interface Subscription {
  id: string;
  tier: SubscriptionTier;
  seats: number;
  status: SubscriptionStatus;
  updated_at: string;
}
export interface CheckoutSession {
  id: string;
  url: string;
}

const getSubscription = async ({
  token,
  workspaceId,
}: {
  token: string;
  workspaceId: string;
}) => {
  const response = await axios.get<Subscription | null>(
    `${config.baseUrl}/workspace/${workspaceId}/subscription`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
const postSubscriptionCheckout = async ({
  token,
  workspaceId,
  tier,
  seats,
}: {
  token: string;
  workspaceId: string;
  tier: SubscriptionTier;
  seats: number;
}) => {
  const response = await axios.post<CheckoutSession>(
    `${config.baseUrl}/workspace/${workspaceId}/subscription/checkout`,
    { tier, seats },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
const putSubscription = async ({
  token,
  workspaceId,
  tier,
  seats,
}: {
  token: string;
  workspaceId: string;
  tier?: SubscriptionTier;
  seats?: number;
}) => {
  const response = await axios.put<Subscription>(
    `${config.baseUrl}/workspace/${workspaceId}/subscription/update-subscription`,
    { tier, seats },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
const deleteSubscription = async ({
  token,
  workspaceId,
}: {
  token: string;
  workspaceId: string;
}) => {
  const response = await axios.delete<Subscription>(
    `${config.baseUrl}/workspace/${workspaceId}/subscription`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const useBilling = (workspaceId: string) => {
  const { token } = useAuth();

  const fetchSubscriptionMutation = useMutation({
    mutationFn: getSubscription,
  });
  const checkoutSubscriptionMutation = useMutation({
    mutationFn: postSubscriptionCheckout,
    onSuccess: (data) => {
      const url = data.url;
      window.location.replace(url);
    },
  });
  const updateSubscriptionMutation = useMutation({
    mutationFn: putSubscription,
    onSuccess: () => {
      if (token) memoisedFetchSubscription({ token, workspaceId });
    },
  });
  const deleteSubscriptionMutation = useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      if (token) memoisedFetchSubscription({ token, workspaceId });
    },
  });

  const memoisedFetchSubscription = useMemo(
    () => fetchSubscriptionMutation.mutate,
    [fetchSubscriptionMutation.mutate]
  );

  const checkout = async ({
    tier,
    seats,
  }: {
    tier: SubscriptionTier;
    seats: number;
  }) => {
    if (token) {
      checkoutSubscriptionMutation.mutate({
        token,
        workspaceId,
        tier,
        seats,
      });
    }
  };
  const cancelSubscription = async () => {
    if (token) {
      deleteSubscriptionMutation.mutate({
        token,
        workspaceId,
      });
    }
  };

  const updateSubscription = async ({
    tier,
    seats,
  }: {
    tier?: SubscriptionTier;
    seats?: number;
  }) => {
    if (token) {
      updateSubscriptionMutation.mutate({
        token,
        workspaceId,
        tier,
        seats,
      });
    }
  };

  useEffect(() => {
    if (token && workspaceId) memoisedFetchSubscription({ token, workspaceId });
  }, [token, workspaceId, memoisedFetchSubscription]);

  return {
    subscription: fetchSubscriptionMutation.data,
    subscriptionState: fetchSubscriptionMutation.status,
    subscriptionError: fetchSubscriptionMutation.error,

    checkout,
    checkoutSession: checkoutSubscriptionMutation.data,
    checkoutState: checkoutSubscriptionMutation.status,
    checkoutError: checkoutSubscriptionMutation.error,

    updateSubscription,
    updateSubscriptionState: updateSubscriptionMutation.status,
    updateSubscriptionError: updateSubscriptionMutation.error,

    cancelSubscription,
    cancelSubscriptionState: deleteSubscriptionMutation.status,
    cancelSubscriptionError: deleteSubscriptionMutation.error,
  };
};
