import { connectedDB } from "@/lib/mongodb";
import { Users, Mail, Calendar, Shield } from "lucide-react";

export default async function AdminUsersPage() {
  const db = await connectedDB();
  const users = await db
    .collection("users")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <section className="mx-auto max-w-7xl p-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Users</h1>
          <p className="mt-1 text-stone-500 text-sm">{users.length} registered user{users.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100">
          <Users size={20} className="text-amber-600" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Users",  value: users.length,                                              color: "text-black"       },
          { label: "Admins",       value: users.filter((u: any) => u.role === "admin").length,       color: "text-amber-600"   },
          { label: "Regular Users",value: users.filter((u: any) => u.role !== "admin").length,       color: "text-stone-600"   },
          { label: "This Month",   value: users.filter((u: any) => {
              const d = new Date(u.createdAt);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length,                                                                                color: "text-green-600"   },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5">
            <p className="text-[0.62rem] font-bold uppercase tracking-widest text-stone-400 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {users.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-200 p-20 text-center">
          <Users size={40} className="mx-auto text-stone-200 mb-4" />
          <p className="text-xl font-semibold text-stone-400">No users yet</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-100 bg-white shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-6 py-4 bg-stone-50 border-b border-stone-100 text-[0.62rem] font-bold uppercase tracking-widest text-stone-400">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Joined</span>
          </div>

          {/* Rows */}
          {users.map((user: any) => (
            <div
              key={user._id.toString()}
              className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-6 py-4 border-b border-stone-50 last:border-0 items-center hover:bg-stone-50/50 transition-colors"
            >
              {/* Name + avatar */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-sm font-bold">
                  {user.fullName?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-semibold text-black text-sm">{user.fullName}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 text-sm text-stone-500 min-w-0">
                <Mail size={13} className="text-amber-500 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>

              {/* Role */}
              <div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-bold border ${
                  user.role === "admin"
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : "bg-stone-50 border-stone-200 text-stone-500"
                }`}>
                  {user.role === "admin" && <Shield size={10} />}
                  {user.role === "admin" ? "Admin" : "User"}
                </span>
              </div>

              {/* Joined date */}
              <div className="flex items-center gap-1.5 text-xs text-stone-400">
                <Calendar size={12} className="text-amber-500" />
                {new Date(user.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
