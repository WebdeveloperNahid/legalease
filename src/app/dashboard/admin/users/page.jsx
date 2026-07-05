import { getAllTransactions } from "@/lib/actions/transactions";
import { getUsersList } from "@/lib/api/users";
import React from "react";

const AdminUserPage = async () => {
   const transactions = await getAllTransactions();
  const data = await getUsersList();
  const users = data.users;

  return (
    <div>
      <h2>Admin users: {users.length} </h2>

    </div>
  );
};

export default AdminUserPage;
