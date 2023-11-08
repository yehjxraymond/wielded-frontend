import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Workspace, useWorkspace } from "@/context/WorkspaceContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { useWorkspaceMembers } from "./useWorkspaceMembers";

const inviteSchema = z.object({
  email: z.string().min(3).max(50),
  role: z.enum(["user", "admin", "owner"]),
});

export const MembersSettingForm: FunctionComponent<{
  workspace: Workspace;
}> = ({ workspace }) => {
  const { invites, inviteMember, inviteMemberStatus } = useWorkspaceMembers(
    workspace.id
  );
  console.log(invites);

  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: "user",
    },
  });
  const isPendingInvite = inviteMemberStatus === "pending";
  function onSubmit(values: z.infer<typeof inviteSchema>) {
    inviteMember({
      email: values.email,
      role: values.role,
    });
  }

  return (
    <>
      <div className="text-xl font-semibold">Members Settings</div>
      <div className="font-medium mt-4">Invite Member</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          {false && (
            <Alert>
              <AlertTitle>Updated</AlertTitle>
              <AlertDescription>
                Workspace settings have been updated!
              </AlertDescription>
            </Alert>
          )}
          <div className="flex space-x-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="person@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-32">
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      {workspace.role === "owner" && (
                        <SelectItem value="owner">Owner</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={isPendingInvite}>
              Add Member
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

const NoPermission = () => {
  return (
    <div>
      <div className="text-xl font-semibold">Members Settings</div>
      <div className="mt-4 text-sm font-semibold text-accent-foreground">
        You do not have permission to edit this workspace.
      </div>
    </div>
  );
};

export const MembersSetting = () => {
  const workspace = useWorkspace();
  if (workspace.state === "success") {
    const currentWorkspace = workspace.workspaces.find(
      (w) => w.id === workspace.currentWorkspace
    );
    if (!currentWorkspace) return <NoPermission />;
    if (currentWorkspace.role === "user") return <NoPermission />;
    return <MembersSettingForm workspace={currentWorkspace} />;
  }
  return (
    <div>
      <div className="text-xl font-semibold">Members Settings</div>
      <Skeleton className="mt-4 h-5 w-[250px]" />
      <Skeleton className="mt-4 h-5 w-[400px]" />
      <Skeleton className="mt-4 h-5 w-[400px]" />
    </div>
  );
};
