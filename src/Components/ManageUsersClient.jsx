"use client";

import { changeUserRole, deleteUser } from "@/lib/actions/manege-users";
import { useState } from "react";
import toast from "react-hot-toast";
// import { changeUserRole, deleteUser } from "@/lib/actions/manage-users";

const ROLES = ["user", "lawyer", "admin"];

export default function ManageUsersClient({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingEmail, setLoadingEmail] = useState(null);

  const handleRoleChange = async (email, newRole) => {
    setLoadingEmail(email);
    const result = await changeUserRole(email, newRole);
    setLoadingEmail(null);

    if (result.success) {
      toast.success(result.message);
      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, role: newRole } : u))
      );
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (email) => {
    if (!confirm(`Delete user ${email}? This cannot be undone.`)) return;

    setLoadingEmail(email);
    const result = await deleteUser(email);
    setLoadingEmail(null);

    if (result.success) {
      toast.success(result.message);
      setUsers((prev) => prev.filter((u) => u.email !== email));
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-6 py-14 font-sans">
      <div className="mx-auto max-w-[900px]">
        <h1 className="mb-8 font-[Georgia,_serif] text-[28px] font-extrabold text-[#11100C]">
          Manage Users
        </h1>

        <div className="overflow-hidden rounded-[20px] border border-[#eee5d3] bg-white">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#eee5d3] text-[11px] uppercase tracking-[1px] text-[#8a8578]">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="border-b border-[#f3efe4] last:border-0">
                  <td className="px-5 py-4 font-bold text-[#11100C]">{u.name}</td>
                  <td className="px-5 py-4 text-[#8a8578]">{u.email}</td>
                  <td className="px-5 py-4">
                    <select
                      value={u.role}
                      disabled={loadingEmail === u.email}
                      onChange={(e) => handleRoleChange(u.email, e.target.value)}
                      className="rounded-lg border border-[#AF8752]/30 px-2 py-1 text-[12px]"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleDelete(u.email)}
                      disabled={loadingEmail === u.email}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}