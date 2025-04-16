"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/common";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Ban, Check } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import axios from "axios";
import { BASE_BACKEND_URL } from "@/lib/constant";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

const ApproveCell = ({ approved }: { approved: boolean }) => {
  return (
    <Badge
      className={
        approved ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }
    >
      {approved ? "Approved" : "Pending"}
    </Badge>
  );
};

const ActionCell = ({ user }: { user: any }) => {
  const { getToken } = useAuth();

  const approveUser = async () => {
    const token = await getToken();
    try {
      const res = await axios.patch(
        `${BASE_BACKEND_URL}/admin/user-approve`,
        {
          userId: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      if (res?.data?.data) {
        toast.success("User approved");
        return;
      } else if (res?.data?.error) {
        toast.error(res?.data?.message);
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("Server side error");
      return;
    }
  };

  const bannedUser = async () => {
    const token = await getToken();

    console.log('banned')

    try {
      const res = await axios.patch(
        `${BASE_BACKEND_URL}/admin/user-toggle-ban`,
        {
          banned: true,
          userId: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      if (res?.data?.data) {
        toast.success("User banned");
        return;
      } else if (res?.data?.error) {
        toast.error(res?.data?.message);
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("Server eror");
      return;
    }
  };

  const unbannedUsers = async () => {
    const token = await getToken();

    try {
      const res = await axios.patch(
        `${BASE_BACKEND_URL}/admin/user-toggle-ban`,
        {
          banned: false,
          userId: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res?.data?.data) {
        toast.success("User Unbanned");
        return;
      } else if (res?.data?.error) {
        toast.error(res?.data?.message);
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("Server eror");
      return;
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 w-fit justify-center">
      <Toggle
        aria-label="Toggle italic"
        data-state={user.banned ? "on" : "off"}
      >
        {user.banned ? (
          <span
            className="h-8 w-26 px-1 py-0 flex justify-start items-center"
            onClick={unbannedUsers}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Unbanned
          </span>
        ) : (
          <span className="h-8 w-26 px-1 py-0 flex justify-start items-center">
            <Ban className="h-4 w-4 mr-2" onClick={bannedUser} />
            Ban
          </span>
        )}
      </Toggle>

      {!user.approved && (
        <Toggle
          aria-label="Toggle italic"
          data-state={user.approved ? "on" : "off"}
          className="flex gap-4"
        >
          <span
            className="h-8 w-26 px-1 py-0 flex justify-start items-center"
            onClick={approveUser}
          >
            <Check className="h-4 w-4 mr-2" />
            Approve
          </span>
        </Toggle>
      )}
    </div>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "approved",
    header: "Approved",
    cell: ({ row }) => {
      const approved = row.getValue("approved") as boolean;
      return <ApproveCell approved={approved} />;
    },
  },
  {
    accessorKey: "lastActiveAt",
    header: "Last Active",
    cell: ({ row }) => {
      const date = row.getValue("lastActiveAt") as Date;
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      const user: any = row.original;

      return <ActionCell user={user} />;
    },
  },
];
