

import ManageUsersClient from "@/Components/ManageUsersClient";
import { getAllUsers } from "@/lib/api/manege-user";
import { requireRole } from "@/lib/core/session";

const ManageUsersPage = async () => {
  await requireRole("admin"); 

  const users = await getAllUsers();

  return <ManageUsersClient users={users} />;
};

export default ManageUsersPage;