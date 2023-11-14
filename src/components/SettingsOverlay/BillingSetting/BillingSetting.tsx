import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Check, CheckCircle, X } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { Skeleton } from "../../ui/skeleton";
import { NoPermission } from "../NoPermission";
import { useWorkspaceMembers } from "../MembersSetting/useWorkspaceMembers";
import { useBilling } from "./useBilling";

const freeFeatures = [
  "ChatGPT access",
  "Unlimited conversations",
  "Up to 2 team members",
  "Up to 5 personas",
];

const teamFeatures = [
  "Email support",
  "Unlimited personas",
  "No limit to team members",
];

const NoSubscription: FunctionComponent<{
  checkout: ReturnType<typeof useBilling>["checkout"];
  members: number;
}> = ({ checkout, members }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [seats, setSeats] = useState(members.toString());

  const seatsNo = Number(seats);
  const price = seatsNo * 7;
  const changeSeats = (delta: number) => {
    const newSeats = seatsNo + delta;
    if (newSeats < 0) return;
    setSeats(newSeats.toString());
  };

  const handleCheckout = () => {
    checkout({ tier: "team", seats: seatsNo });
  };

  return (
    <div className="mt-8">
      {!showCheckout && (
        <div>
          <div className="mb-4 flex justify-between">
            <div>
              <div className="text-lg font-semibold">Free Plan</div>
              <div className="text-muted-foreground">
                The basic for individuals and teams of 2
              </div>
            </div>
            <div>
              <div className="font-semibold">$0/user/month</div>
              <div>{members} active members</div>
            </div>
          </div>
          <div className="grid grid-cols-2 my-8">
            <div>
              <div className="font-semibold">Included:</div>
              {freeFeatures.map((feature, i) => (
                <div className="flex items-center gap-x-2" key={i}>
                  <Check className="text-green-600" size={16} />
                  {feature}
                </div>
              ))}
            </div>
            <div>
              <div className="font-semibold">Not Included:</div>
              {teamFeatures.map((feature, i) => (
                <div className="flex items-center gap-x-2" key={i}>
                  <X className="text-red-600" size={16} />
                  {feature}
                </div>
              ))}
            </div>
          </div>
          <Button onClick={() => setShowCheckout(true)}>Upgrade to Team</Button>
        </div>
      )}
      {showCheckout && (
        <div>
          <div>
            <div className="text-lg font-semibold mb-4">Upgrade to Team</div>
          </div>
          <div className="font-semibold text-xl">
            How many seats do you want to include?
          </div>
          <div className="text-sm">
            Each seat cost $7/month. Your workspace is currently using {members}{" "}
            seats.
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
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
            />
            <Button
              size="sm"
              className="rounded-l-none w-9 font-semibold"
              onClick={() => changeSeats(1)}
            >
              +
            </Button>
          </div>

          <div className="text-xl font-semibold mb-2 mt-10">Payment Due</div>
          <div className="font-semibold">${price.toFixed(2)} per month</div>
          <Button className="mt-6" onClick={handleCheckout}>
            Checkout (via Stripe)
          </Button>
        </div>
      )}
    </div>
  );
};

type ActiveSubscriptionMode = "dashboard" | "update-seats" | "cancel";

const ActiveSubscription: FunctionComponent<{
  subscription: ReturnType<typeof useBilling>["subscription"];
  updateSubscription: ReturnType<typeof useBilling>["updateSubscription"];
  cancelSubscription: ReturnType<typeof useBilling>["cancelSubscription"];
  members: number;
}> = ({ members, subscription, updateSubscription, cancelSubscription }) => {
  const [mode, setMode] = useState<ActiveSubscriptionMode>("dashboard");
  const [seats, setSeats] = useState(subscription?.seats.toString());

  const seatsNo = Number(seats);
  const price = seatsNo * 7;
  const changeSeats = (delta: number) => {
    const newSeats = seatsNo + delta;
    if (newSeats < 0) return;
    setSeats(newSeats.toString());
  };

  const handleSeatsUpdate = () => {
    if (seatsNo === 0) {
      cancelSubscription();
    } else {
      updateSubscription({ seats: seatsNo });
    }
  };

  if (!subscription) return null;
  if (mode === "dashboard")
    return (
      <div className="mt-8">
        <div className="mb-4 flex justify-between">
          <div>
            <div className="text-lg font-semibold">Team Plan</div>
            <div className="text-muted-foreground">
              The most flexible plan for teams for all sizes
            </div>
          </div>
          <div>
            <div className="font-semibold">$7/user/month</div>
            <div>{members} active members</div>
          </div>
        </div>
        <div className="grid grid-cols-2 my-8">
          <div>
            <div className="font-semibold">Included:</div>
            {freeFeatures.map((feature, i) => (
              <div className="flex items-center gap-x-2" key={i}>
                <CheckCircle className="text-green-600" size={16} />
                {feature}
              </div>
            ))}
          </div>
          <div>
            <div className="font-semibold">Also Included:</div>
            {teamFeatures.map((feature, i) => (
              <div className="flex items-center gap-x-2" key={i}>
                <CheckCircle className="text-green-600" size={16} />
                {feature}
              </div>
            ))}
          </div>
        </div>
        <div className="text-xl font-semibold mb-2 mt-10">Current Cost</div>
        <div className="font-semibold">${price.toFixed(2)} per month</div>
        <div className="mt-10">
          <Button onClick={() => setMode("update-seats")}>
            Add/Remove Seats
          </Button>
        </div>
      </div>
    );
  if (mode === "update-seats")
    return (
      <div>
        <div className="font-semibold text-xl">
          How many seats do you want to include?
        </div>
        <div className="text-sm">
          Each seat cost $7/month. Your workspace is currently using {members}{" "}
          seats.
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
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
          />
          <Button
            size="sm"
            className="rounded-l-none w-9 font-semibold"
            onClick={() => changeSeats(1)}
          >
            +
          </Button>
        </div>
        <div className="text-xl font-semibold mb-2 mt-10">New Payment Due</div>
        <div className="font-semibold">${price.toFixed(2)} per month</div>
        <Button className="mt-6" onClick={handleSeatsUpdate}>
          {seatsNo > 0 ? "Update Billing" : "Cancel Subscription"}
        </Button>
      </div>
    );
};

const BillingSettingInternal: FunctionComponent<{ workspaceId: string }> = ({
  workspaceId,
}) => {
  const { members, fetchWorkspaceMemberMutation } =
    useWorkspaceMembers(workspaceId);
  const billing = useBilling(workspaceId);
  const { subscription, checkout, updateSubscription, cancelSubscription } =
    billing;

  const isNoSubscription =
    !subscription ||
    subscription.status === "canceled" ||
    subscription.status === "initializing";
  const isSubscribed = subscription && subscription.status === "active";

  if (fetchWorkspaceMemberMutation.isPending) return <Skeleton />;

  return (
    <div>
      <div className="text-xl font-semibold">Billing Settings</div>
      {isNoSubscription && (
        <NoSubscription checkout={checkout} members={members.length} />
      )}
      {isSubscribed && (
        <ActiveSubscription
          members={members.length}
          subscription={subscription}
          updateSubscription={updateSubscription}
          cancelSubscription={cancelSubscription}
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
    return <BillingSettingInternal workspaceId={workspace.currentWorkspace} />;
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
