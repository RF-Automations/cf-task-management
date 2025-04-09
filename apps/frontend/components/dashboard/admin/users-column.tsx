"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/common";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Ban, Check } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={
            status === "approved"
              ? "bg-green-500"
              : status === "banned"
                ? "bg-red-500"
                : "bg-yellow-500"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ row }) => {
      const date = row.getValue("lastActive") as Date;
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      const user: any = row.original;

      return (
        <div className="flex flex-col items-start gap-2 w-fit justify-center">
          <Toggle
            aria-label="Toggle italic"
            data-state={user.banned ? "on" : "off"}
          >
            {user.banned ? (
              <span className="h-8 w-26 px-1 py-0 flex justify-start items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Unbanned
              </span>
            ) : (
              <span className="h-8 w-26 px-1 py-0 flex justify-start items-center">
                <Ban className="h-4 w-4 mr-2" />
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
              <span className="h-8 w-26 px-1 py-0 flex justify-start items-center">
                <Check className="h-4 w-4 mr-2" />
                Approve
              </span>
            </Toggle>
          )}
        </div>
      );
    },
  },
];
