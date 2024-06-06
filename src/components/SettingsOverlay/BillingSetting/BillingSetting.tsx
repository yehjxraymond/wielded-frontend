import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Check, Feather, FlaskConical, Home, Hotel } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../../ui/skeleton";
import { useWorkspaceMembers } from "../MembersSetting/useWorkspaceMembers";
import { NoPermission } from "../NoPermission";
import { SubscriptionTier, useBilling } from "./useBilling";

type AppState =
  | {
      type: "dashboard";
    }
  | {
      type: "new-subscription";
      targetTier: SubscriptionTier;
    }
  | {
      type: "change-tier";
      targetTier: SubscriptionTier;
    }
  | {
      type: "cancel-plan";
      currentTier: SubscriptionTier;
    }
  | {
      type: "update-seats";
    };

interface Plan {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
  price: string;
  priceNumber: number;
  includes: string[];
  cta?: {
    targetPlan: string;
    title: string;
    description: string[];
    ctaText: string;
  };
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free Plan",
    icon: <FlaskConical size={50} className="text-muted-foreground mb-4" />,
    description: "The basic for individuals and teams of 2",
    priceNumber: 0,
    price: "$0/user/month",
    includes: [
      "Bring your own keys",
      "Chat with GPT-3.5 & GPT-4",
      "Chat with Claude 2 & Claude 3",
      "Image generation with Dall-E 3",
      "Speech-to-text input with Whisper",
      "Up to 2 team members in workspace",
      "Up to 5 personas per user",
    ],
    cta: {
      targetPlan: "team_pro",
      title: "Access all AI models",
      description: [
        "Upgrade to Pro to get access to all models & features without bringing your own keys.",
        "Get instant access to GPT-4 Turbo, Claude 3, Image generation, and Speech-to-text input!",
      ],
      ctaText: "Upgrade to Pro",
    },
  },
  {
    id: "team",
    name: "Lite Plan",
    icon: <Feather size={50} className="text-muted-foreground mb-4" />,
    description: "Bring-your-own-key plan for teams",
    price: "$3.50/user/month",
    priceNumber: 3.5,
    includes: [
      "Everything in free plan",
      "Unlimited team members in workspace",
      "Unlimited personas per user",
      "Access to early access features",
      "Email support",
    ],
    cta: {
      targetPlan: "team_pro",
      title: "Greater data privacy",
      description: [
        "Upgrade to Pro for greater data privacy with private models.",
        "Your data is not shared with model providers or used to improve the base model with Pro.",
      ],
      ctaText: "Upgrade to Pro",
    },
  },
  {
    id: "team_pro",
    name: "Pro Plan",
    icon: <Home size={50} className="text-muted-foreground mb-4" />,
    description: "Access to all AI models while keeping data private.",
    price: "$20/user/month",
    priceNumber: 20,
    includes: [
      "GPT 3.5 Turbo & GPT-4 Turbo subscription",
      "Claude 2 & Claude 3 subscription",
      "Dall-E 3 subscription",
      "Whisper subscription",
      "Foundation model does not train on your data",
      "Unlimited team members in workspace",
      "Unlimited personas per user",
      "Access to early access features",
      "Email support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: <Hotel size={50} className="text-muted-foreground mb-4" />,
    description: "For large organizations with custom needs",
    price: "Contact Sales for pricing",
    priceNumber: 0,
    includes: [
      "Everything in Lite or Pro plan",
      "Custom domain",
      "Single sign-on (SSO)",
      "Dedicated account manager",
    ],
  },
];

const CurrentPlan = ({
  plan,
  currentMembers,
  currentSeats,
  setAppState,
  eligibleForFreeTrial,
}: {
  plan: Plan;
  currentMembers: number;
  currentSeats: number;
  eligibleForFreeTrial: boolean;
  setAppState: (state: AppState) => void;
}) => {
  const handleCta = () => {
    if (!plan.cta) return;
    if (plan.id !== "free") {
      setAppState({
        type: "change-tier",
        targetTier: plan.cta.targetPlan as SubscriptionTier,
      });
    } else {
      setAppState({
        type: "new-subscription",
        targetTier: plan.cta.targetPlan as SubscriptionTier,
      });
    }
  };
  return (
    <div className="flex justify-between mt-8 space-x-2">
      <div className="basis-3/12">
        {plan.icon}
        <div className="text-xs font-medium">Current Plan</div>
        <div className="font-semibold">{plan.name}</div>
        <div className="text-sm mt-2">{plan.price}</div>
        <div className="text-xs font-medium mt-4">
          No. Workspace Users: {currentMembers}
        </div>
        {plan.id !== "free" && (
          <div className="text-xs font-medium mt-1">
            No. Seats: {currentSeats}
          </div>
        )}
        {(plan.id === "team" || plan.id === "team_pro") && (
          <Button
            size="sm"
            className="mt-4 whitespace-nowrap"
            onClick={() => setAppState({ type: "update-seats" })}
          >
            Change No. Seats
          </Button>
        )}
      </div>
      <div className="basis-5/12 flex-grow">
        <div className="font-semibold">Includes</div>
        <div className="space-y-1 mt-2">
          {plan.includes.map((item, i) => (
            <div className="text-sm font-medium" key={i}>
              <Check className="text-green-600 inline-block mr-2" size={16} />
              {item}
            </div>
          ))}
        </div>
      </div>
      {plan.cta && (
        <div className="basis-4/12">
          <div className="font-semibold">{plan.cta.title}</div>
          <div className="text-sm space-y-2 mt-2">
            {plan.cta.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <Button size="sm" className="mt-4" onClick={handleCta}>
            {plan.cta.ctaText}
          </Button>

          {eligibleForFreeTrial && (
            <div className="text-xs mt-2">*Free trial for 7 days.</div>
          )}
        </div>
      )}
    </div>
  );
};

const SelectablePlan = ({
  currentPlan,
  targetPlan,
  setAppState,
  eligibleForFreeTrial,
}: {
  targetPlan: Plan;
  currentPlan: Plan;
  eligibleForFreeTrial: boolean;
  setAppState: (state: AppState) => void;
}) => {
  const { toast } = useToast();
  const currentTier = currentPlan.id;
  const upgradeOrDowngrade =
    currentTier === "free" ||
    targetPlan.id === "enterprise" ||
    (currentPlan.id === "team" && targetPlan.id !== "free")
      ? "Upgrade to"
      : "Downgrade to";

  const handleChange = () => {
    switch (true) {
      case currentTier === "free" && targetPlan.id === "team":
        setAppState({
          type: "new-subscription",
          targetTier: targetPlan.id as SubscriptionTier,
        });
        break;
      case currentTier === "free" && targetPlan.id === "team_pro":
        setAppState({
          type: "new-subscription",
          targetTier: targetPlan.id as SubscriptionTier,
        });
        break;
      case currentTier === "team" && targetPlan.id === "team_pro":
        setAppState({
          type: "change-tier",
          targetTier: targetPlan.id as SubscriptionTier,
        });
        break;
      case currentTier === "team_pro" && targetPlan.id === "team":
        setAppState({
          type: "change-tier",
          targetTier: targetPlan.id as SubscriptionTier,
        });
        break;
      case currentTier === "team_pro" && targetPlan.id === "free":
      case currentTier === "team" && targetPlan.id === "free":
        setAppState({
          type: "cancel-plan",
          currentTier: currentTier as SubscriptionTier,
        });
        break;
      case targetPlan.id === "enterprise":
        toast({
          title: "Please contact sales for enterprise plan",
        });
        break;
    }
  };

  return (
    <div className="flex justify-between mt-8 space-x-2">
      <div className="basis-3/12">
        {targetPlan.icon}
        <div className="font-semibold">{targetPlan.name}</div>
        <div className="text-sm mt-2 font-medium">{targetPlan.description}</div>
        <div className="text-sm mt-2">{targetPlan.price}</div>
      </div>
      <div className="basis-6/12 flex-grow">
        <div className="font-semibold">Includes</div>
        <div className="space-y-1 mt-2">
          {targetPlan.includes.map((item, i) => (
            <div className="text-sm font-medium" key={i}>
              <Check className="text-green-600 inline-block mr-2" size={16} />
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="basis-3/12 flex justify-center">
        <div>
          <Button
            size="sm"
            className="mt-4 whitespace-nowrap"
            onClick={handleChange}
          >
            {upgradeOrDowngrade} {targetPlan.name}
          </Button>
          {eligibleForFreeTrial &&
            (targetPlan.id === "team" || targetPlan.id === "team_pro") && (
              <div className="text-xs mt-2">*Free trial for 7 days.</div>
            )}
        </div>
      </div>
    </div>
  );
};

const PlanInfo = ({ tier }: { tier: SubscriptionTier }) => {
  const plan = plans.find((p) => p.id === tier);
  if (!plan) throw new Error("Plan not found");
  return (
    <div className="flex justify-between mt-8 space-x-2">
      <div className="basis-4/12">
        {plan.icon}
        <div className="text-xs font-medium">Current Plan</div>
        <div className="font-semibold">{plan.name}</div>
        <div className="text-sm mt-2">{plan.price}</div>
      </div>
      <div className="basis-8/12 flex-grow">
        <div className="font-semibold">Includes</div>
        <div className="space-y-1 mt-2">
          {plan.includes.map((item, i) => (
            <div className="text-sm font-medium" key={i}>
              <Check className="text-green-600 inline-block mr-2" size={16} />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NewSubscription: React.FC<{
  eligibleForFreeTrial: boolean;
  currentMembers: number;
  backToDashboard: () => void;
  targetTier: SubscriptionTier;
  checkout: (plan: { tier: SubscriptionTier; seats: number }) => void;
}> = ({
  currentMembers,
  backToDashboard,
  targetTier,
  checkout,
  eligibleForFreeTrial,
}) => {
  const [targetSeats, setTargetSeats] = useState(currentMembers.toString());
  const plan = plans.find((p) => p.id === targetTier);
  if (!plan) throw new Error("Plan not found");

  const price = Number(targetSeats) * plan.priceNumber;

  const changeSeats = (delta: number) => {
    const newSeats = Number(targetSeats) + delta;
    if (newSeats < 0) return;
    setTargetSeats(newSeats.toString());
  };

  const handleCheckout = () => {
    checkout({ tier: targetTier, seats: Number(targetSeats) });
  };

  return (
    <div>
      <div
        className="font-medium mt-4 mb-2 cursor-pointer"
        onClick={backToDashboard}
      >
        &lt; Back
      </div>
      <div className="text-lg font-medium">New Subscription</div>
      <PlanInfo tier={targetTier} />
      <hr className="my-14" />
      <div className="font-semibold text-xl">
        How many seats do you want to include?
      </div>
      <div className="text-sm">
        Your workspace is currently using {currentMembers} seats.
      </div>
      <div className="flex w-32 mt-8">
        <Button
          size="sm"
          className="rounded-r-none w-9 font-semibold"
          onClick={() => changeSeats(-1)}
        >
          -
        </Button>
        <Input
          type="number"
          className="h-9 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={targetSeats}
          onChange={(e) => setTargetSeats(e.target.value)}
        />
        <Button
          size="sm"
          className="rounded-l-none w-9 font-semibold"
          onClick={() => changeSeats(1)}
        >
          +
        </Button>
      </div>

      {eligibleForFreeTrial ? (
        <>
          <div className="text-xl font-semibold mb-2 mt-10">
            Monthly Payment (after 7 days)
          </div>
          <div className="font-semibold text-sm">
            ${price.toFixed(2)} per month
          </div>

          <div className="text-xl font-semibold mb-2 mt-10">
            Payment Due Today
          </div>
          <div className="font-semibold">$0 (free trial)</div>
        </>
      ) : (
        <>
          <div className="text-xl font-semibold mb-2 mt-10">
            Monthly Payment
          </div>
          <div className="font-semibold text-sm">
            ${price.toFixed(2)} per month
          </div>
        </>
      )}

      <Button className="mt-6" onClick={handleCheckout}>
        Checkout (via Stripe)
      </Button>
    </div>
  );
};

const ChangeSeats: React.FC<{
  currentSeats: number;
  currentTier: SubscriptionTier;
  backToDashboard: () => void;
  updateSubscriptionAsync: (plan: { seats: number }) => void;
}> = ({
  currentTier,
  currentSeats,
  backToDashboard,
  updateSubscriptionAsync,
}) => {
  const { toast } = useToast();
  const [targetSeats, setTargetSeats] = useState(currentSeats);
  const plan = plans.find((p) => p.id === currentTier);
  if (!plan) throw new Error("Plan not found");

  const handleUpdate = async () => {
    try {
      await updateSubscriptionAsync({ seats: targetSeats });
      backToDashboard();
      toast({
        title: "Subscription updated",
        description: `You have successfully updated your subscription to the ${plan.name} plan.`,
      });
    } catch (e) {
      toast({
        title: "Failed to update subscription",
        description: (e as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div
        className="font-medium mt-4 mb-2 cursor-pointer"
        onClick={backToDashboard}
      >
        &lt; Back
      </div>
      <div className="text-lg font-medium">Change Seats</div>
      <PlanInfo tier={currentTier} />
      <hr className="my-14" />
      <div className="text-xl font-semibold">Change Seats</div>
      <div className="text-sm">
        You are currently on the {plan.name} plan. You are about to change the
        number of seats.
      </div>
      <div className="flex w-32 mt-8">
        <Button
          size="sm"
          className="rounded-r-none w-9 font-semibold"
          onClick={() => setTargetSeats(targetSeats - 1)}
        >
          -
        </Button>
        <Input
          type="number"
          className="h-9 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={targetSeats}
          onChange={(e) => setTargetSeats(Number(e.target.value))}
        />
        <Button
          size="sm"
          className="rounded-l-none w-9 font-semibold"
          onClick={() => setTargetSeats(targetSeats + 1)}
        >
          +
        </Button>
      </div>
      <Button className="mt-6" onClick={handleUpdate}>
        Confirm Change
      </Button>
    </div>
  );
};

const ChangePlan: React.FC<{
  currentTier: SubscriptionTier;
  targetTier: SubscriptionTier;
  backToDashboard: () => void;
  updateSubscriptionAsync: (plan: { tier: SubscriptionTier }) => void;
}> = ({
  currentTier,
  targetTier,
  backToDashboard,
  updateSubscriptionAsync,
}) => {
  const { toast } = useToast();
  const plan = plans.find((p) => p.id === targetTier);
  if (!plan) throw new Error("Plan not found");
  const currentPlan = plans.find((p) => p.id === currentTier);
  if (!currentPlan) throw new Error("Current plan not found");

  const handleUpdate = async () => {
    try {
      await updateSubscriptionAsync({ tier: targetTier });
      toast({
        title: "Subscription updated",
        description: `You have successfully updated your subscription to the ${plan.name} plan.`,
      });
      backToDashboard();
    } catch (e) {
      toast({
        title: "Failed to update subscription",
        description: (e as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div
        className="font-medium mt-4 mb-2 cursor-pointer"
        onClick={backToDashboard}
      >
        &lt; Back
      </div>
      <div className="text-lg font-medium">Change Plan</div>
      <PlanInfo tier={targetTier} />
      <hr className="my-14" />
      <div className="text-xl font-semibold">Change Plan</div>
      <div className="text-sm">
        You are currently on the {currentPlan.name} plan. You are about to
        change to the {plan.name} plan.
      </div>
      <Button className="mt-6" onClick={handleUpdate}>
        Confirm Change
      </Button>
    </div>
  );
};

const CancelPlan: React.FC<{
  currentTier: SubscriptionTier;
  backToDashboard: () => void;
  cancelSubscriptionAsync: () => void;
}> = ({ currentTier, backToDashboard, cancelSubscriptionAsync }) => {
  const { toast } = useToast();
  const plan = plans.find((p) => p.id === currentTier);
  if (!plan) throw new Error("Plan not found");

  const handleCancel = () => {
    try {
      cancelSubscriptionAsync();
      backToDashboard();
      toast({
        title: "Subscription cancelled",
        description: `You have successfully cancelled your subscription to the ${plan.name} plan.`,
      });
    } catch (e) {
      toast({
        title: "Failed to cancel subscription",
        description: (e as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div
        className="font-medium mt-4 mb-2 cursor-pointer"
        onClick={backToDashboard}
      >
        &lt; Back
      </div>
      <div className="text-lg font-medium">Cancel Plan</div>
      <PlanInfo tier={currentTier} />
      <hr className="my-14" />
      <div className="text-xl font-semibold">Cancel Plan</div>
      <div className="text-sm">
        You are about to cancel your subscription to the {plan.name} plan.
      </div>
      <Button className="mt-6" onClick={handleCancel}>
        Confirm Cancellation
      </Button>
    </div>
  );
};

const BillingSettingPanel = ({ workspaceId }: { workspaceId: string }) => {
  const { members, fetchWorkspaceMemberMutation } =
    useWorkspaceMembers(workspaceId);
  const [appState, setAppState] = useState<AppState>({ type: "dashboard" });
  const billing = useBilling(workspaceId);
  const {
    subscription,
    checkout,
    updateSubscriptionAsync,
    cancelSubscriptionAsync,
  } = billing;

  const currentPlan =
    subscription &&
    (subscription.status === "active" || subscription.status === "trialing")
      ? plans.find((p) => p.id === subscription.tier)
      : plans[0];
  if (!currentPlan) throw new Error("Current plan not found");
  const currentSeats = subscription?.seats || 0;
  const currentMembers = members.length;
  const remainingPlans = plans.filter((p) => p.id !== currentPlan.id);
  const eligibleForFreeTrial =
    !subscription || subscription.status === "initializing";

  if (fetchWorkspaceMemberMutation.isPending) return <Skeleton />;

  const handleBackToDashboard = () => {
    setAppState({ type: "dashboard" });
  };

  return (
    <div>
      <div className="text-xl font-semibold">Billing Settings</div>
      {appState.type === "dashboard" && (
        <>
          <CurrentPlan
            eligibleForFreeTrial={eligibleForFreeTrial}
            plan={currentPlan}
            currentMembers={currentMembers}
            currentSeats={currentSeats}
            setAppState={setAppState}
          />
          <hr className="my-14" />
          <div className="text-xl font-semibold">Change Plan</div>
          <div className="space-y-20 mb-20">
            {remainingPlans.map((plan, i) => (
              <SelectablePlan
                eligibleForFreeTrial={eligibleForFreeTrial}
                currentPlan={currentPlan}
                targetPlan={plan}
                setAppState={setAppState}
                key={i}
              />
            ))}
          </div>
        </>
      )}
      {appState.type === "new-subscription" && (
        <NewSubscription
          eligibleForFreeTrial={eligibleForFreeTrial}
          checkout={checkout}
          backToDashboard={handleBackToDashboard}
          currentMembers={members.length}
          targetTier={appState.targetTier}
        />
      )}
      {appState.type === "change-tier" && (
        <ChangePlan
          currentTier={currentPlan.id as SubscriptionTier}
          targetTier={appState.targetTier}
          backToDashboard={handleBackToDashboard}
          updateSubscriptionAsync={updateSubscriptionAsync}
        />
      )}
      {appState.type === "cancel-plan" && (
        <CancelPlan
          currentTier={appState.currentTier}
          backToDashboard={handleBackToDashboard}
          cancelSubscriptionAsync={cancelSubscriptionAsync}
        />
      )}
      {appState.type === "update-seats" && (
        <ChangeSeats
          currentSeats={currentSeats}
          currentTier={currentPlan.id as SubscriptionTier}
          backToDashboard={handleBackToDashboard}
          updateSubscriptionAsync={updateSubscriptionAsync}
        />
      )}
    </div>
  );
};

export const BillingSetting = () => {
  const workspace = useWorkspace();
  if (workspace.state === "success") {
    const currentWorkspace = workspace.workspaces.find(
      (w) => w.id === workspace.currentWorkspace
    );
    if (!currentWorkspace)
      return (
        <NoPermission title="No Workspace" description="Workspace not found" />
      );
    if (currentWorkspace.role === "user")
      return (
        <NoPermission
          title="Members Settings"
          description="You do not have permission to edit this workspace."
        />
      );
    return <BillingSettingPanel workspaceId={workspace.currentWorkspace} />;
  }
  return (
    <div>
      <div className="text-xl font-semibold">Billing Settings</div>
      <Skeleton className="mt-4 h-5 w-[250px]" />
      <Skeleton className="mt-4 h-5 w-[400px]" />
      <Skeleton className="mt-4 h-5 w-[400px]" />
    </div>
  );
};
