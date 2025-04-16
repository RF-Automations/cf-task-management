"use client";

import { columns } from "@/components/dashboard/admin/users-column";
import { DataTable } from "@/components/data-table/data-table";
import { User } from "@/types/common";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUsers } from "../_actions";

export default function UserPage() {
  const [users, setUsers]  = useState<User[]>([]);
  const { getToken } = useAuth()

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        toast.error("Unable to fetch users");
        return;
      }
      const fetchedUsers: any = await getUsers(token);
      const finalUsers: any = [];

      console.log("user useEffect tasks admin: ", fetchedUsers

      )

      fetchedUsers.data.map((user: any) => {
        const newUser = {
          id: user.id,
          name: user?.firstName + " " + user?.lastName,
          role: user?.role,
          email: user?.email,
          createdAt: user?.createdAt,
          banned: user?.banned,
          approved: user?.approved,
          lastActiveAt: new Date(user?.lastActiveAt)
        };
        finalUsers.push(newUser);
      });
      console.log(finalUsers);
      setUsers(finalUsers);
    })();
  }, [getToken]);

  return (
    <div className="p-4 md:p-6">
      <DataTable columns={columns} data={users} searchKey="name" />
    </div>
  );
}
