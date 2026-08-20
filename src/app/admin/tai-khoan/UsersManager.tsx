"use client";

import { useState } from "react";
import { UserPlus, Trash2, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { ALL_ROLES, ROLE_LABELS, type Role } from "@/lib/permissions";

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: string;
};

export default function UsersManager({
  initialUsers,
  currentEmail,
}: {
  initialUsers: UserRow[];
  currentEmail: string;
}) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Form thêm mới
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("EDITOR");

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Tạo tài khoản thất bại");
      } else {
        setUsers((prev) => [...prev, data.user]);
        setEmail("");
        setName("");
        setPassword("");
        setRole("EDITOR");
      }
    } catch {
      setError("Lỗi kết nối");
    } finally {
      setBusy(false);
    }
  }

  async function changeRole(id: string, newRole: Role) {
    setError("");
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Đổi vai trò thất bại");
    } else {
      setUsers((prev) => prev.map((u) => (u.id === id ? data.user : u)));
    }
  }

  async function resetPassword(id: string) {
    const pw = window.prompt("Nhập mật khẩu mới cho tài khoản này:");
    if (!pw) return;
    setError("");
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Đổi mật khẩu thất bại");
    else window.alert("Đã đổi mật khẩu.");
  }

  async function removeUser(id: string, userEmail: string) {
    if (!window.confirm(`Xoá tài khoản ${userEmail}?`)) return;
    setError("");
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Xoá thất bại");
    else setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={22} className="text-[#e82127]" />
        <h1 className="text-xl font-bold text-[#111114]">Quản lý tài khoản</h1>
      </div>
      <p className="text-sm text-[#6e6e74] mb-6">
        Thêm quản trị viên và phân quyền theo vai trò. Chỉ Quản trị tối cao (SUPER_ADMIN) truy cập được trang này.
      </p>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Form thêm tài khoản */}
      <form onSubmit={addUser} className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-[#111114] mb-4 flex items-center gap-2">
          <UserPlus size={16} className="text-[#e82127]" /> Thêm tài khoản mới
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]"
          />
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Tên hiển thị (tuỳ chọn)" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]"
          />
          <input
            type="text" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]"
          />
          <select
            value={role} onChange={(e) => setRole(e.target.value as Role)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white"
          >
            {ALL_ROLES.map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r]} ({r})</option>
            ))}
          </select>
        </div>
        <button
          type="submit" disabled={busy}
          className="mt-4 inline-flex items-center gap-2 bg-[#e82127] hover:bg-[#c91c21] disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded-xl text-sm"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
          Thêm tài khoản
        </button>
      </form>

      {/* Danh sách tài khoản */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f4f4f6] text-[#6e6e74] text-left">
              <th className="px-4 py-3 font-semibold">Tài khoản</th>
              <th className="px-4 py-3 font-semibold">Vai trò</th>
              <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.email === currentEmail;
              return (
                <tr key={u.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#111114]">{u.name || u.email}</div>
                    <div className="text-[#6e6e74] text-xs">{u.email}{isSelf && " (bạn)"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      disabled={isSelf}
                      onChange={(e) => changeRole(u.id, e.target.value as Role)}
                      className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      {ALL_ROLES.map((r) => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => resetPassword(u.id)}
                      className="text-[#6e6e74] hover:text-[#111114] text-xs font-medium mr-4"
                    >
                      Đổi mật khẩu
                    </button>
                    <button
                      onClick={() => removeUser(u.id, u.email)}
                      disabled={isSelf}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 disabled:text-gray-300 text-xs font-medium"
                    >
                      <Trash2 size={13} /> Xoá
                    </button>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-[#6e6e74]">
                  Chưa có tài khoản nào trong database. Tài khoản đăng nhập bằng biến môi trường vẫn hoạt động với quyền cao nhất.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
