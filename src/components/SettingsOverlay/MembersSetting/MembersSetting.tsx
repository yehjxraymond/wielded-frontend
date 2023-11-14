import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Workspace, useWorkspace } from "@/context/WorkspaceContext";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ColumnDef,
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AlertCircle, MoreHorizontal } from "lucide-react";
import { FunctionComponent, useMemo } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Skeleton } from "../../ui/skeleton";
import { Role, useWorkspaceMembers } from "./useWorkspaceMembers";
import { NoPermission } from "../NoPermission";

const inviteSchema = z.object({
  email: z.string().min(3).max(50),
  role: z.enum(["user", "admin", "owner"]),
});

interface MemberRowInvites {
  type: "invite";
  id: string;
  status: "pending" | "accepted" | "rejected";
  email: string;
  role: Role;
  expiresAt: string;
  createdAt: string;
}

interface MemberRowMembers {
  type: "member";
  membershipId: string;
  userId: string;
  role: Role;
  created_at: string;
  email: string;
}

type MemberRow = MemberRowInvites | MemberRowMembers;

const columnHelper = createColumnHelper<MemberRow>();

interface TableActions {
  cancelInvite: (id: string) => void;
  removeMember: (membershipId: string) => void;
}

export const createColumns = (
  actions: TableActions
): ColumnDef<MemberRow>[] => [
  {
    header: "Member",
    accessorFn: (row) => row.email,
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    header: "Status",
    accessorFn: (row) =>
      row.type === "invite" ? `Invited (${row.status})` : "Active",
  },
  columnHelper.display({
    id: "actions",
    cell: (props) => <RowActions row={props.row} actions={actions} />,
  }),
];

export const RowActions: FunctionComponent<{
  row: Row<MemberRow>;
  actions: TableActions;
}> = ({ row, actions }) => {
  const data = row.original;
  // Function to handle cancelling an invite with confirmation
  const handleCancelInvite = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this invite?")) {
      actions.cancelInvite(id);
    }
  };

  // Function to handle removing a member with confirmation
  const handleRemoveMember = (membershipId: string) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      actions.removeMember(membershipId);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {data.type === "invite" && (
          <DropdownMenuItem onClick={() => handleCancelInvite(data.id)}>
            Cancel Invite
          </DropdownMenuItem>
        )}
        {data.type === "member" && (
          <DropdownMenuItem
            onClick={() => handleRemoveMember(data.membershipId)}
          >
            Remove Member
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function DataTable({
  data,
  tableActions,
}: {
  data: MemberRow[];
  tableActions: TableActions;
}) {
  const tableColumns = useMemo(
    () => createColumns(tableActions),
    [tableActions]
  );
  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={tableColumns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export const MembersSettingForm: FunctionComponent<{
  workspace: Workspace;
}> = ({ workspace }) => {
  const {
    invites,
    members,
    inviteMember,
    inviteMemberStatus,
    inviteMemberError,
    removeMember,
    cancelInvite,
  } = useWorkspaceMembers(workspace.id);

  const combinedMembership = [
    ...invites
      .filter((i) => i.status === "pending")
      .map((i) => {
        return {
          type: "invite" as const,
          ...i,
        };
      }),
    ...members.map((m) => {
      return {
        type: "member" as const,
        ...m,
      };
    }),
  ];

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
    form.setValue("email", "");
  }

  return (
    <>
      <div className="text-xl font-semibold">Members Settings</div>
      <div className="font-medium mt-4">Invite Member</div>
      {inviteMemberError && (
        <div className="flex w-full items-center space-x-2 my-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{inviteMemberError.message}</AlertDescription>
          </Alert>
        </div>
      )}
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

      <div className="font-medium mt-12 mb-4">Members</div>
      <DataTable
        data={combinedMembership}
        tableActions={{ removeMember, cancelInvite }}
      />
    </>
  );
};

export const MembersSetting = () => {
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
