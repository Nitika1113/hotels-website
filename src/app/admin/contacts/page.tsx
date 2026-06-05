"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Clock, Trash2, Reply, Eye, CheckCheck } from "lucide-react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  reply?: string;
  repliedAt?: string;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  unread:  "bg-red-50 text-red-600 border-red-200",
  read:    "bg-stone-50 text-stone-500 border-stone-200",
  replied: "bg-green-50 text-green-600 border-green-200",
};

export default function AdminContactsPage() {
  const [contacts, setContacts]     = useState<Contact[]>([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState<Contact | null>(null);
  const [reply, setReply]           = useState("");
  const [sending, setSending]       = useState(false);
  const [filter, setFilter]         = useState<"all" | "unread" | "read" | "replied">("all");

  async function fetchContacts() {
    const res = await fetch("/api/contact");
    const data = await res.json();
    setContacts(data.data || []);
    setLoading(false);
  }

  useEffect(() => { fetchContacts(); }, []);

  async function markRead(id: string) {
    await fetch(`/api/contact/${id}`, { method: "PATCH" });
    setContacts((p) => p.map((c) => c._id === id ? { ...c, status: "read" } : c));
    if (selected?._id === id) setSelected((p) => p ? { ...p, status: "read" } : p);
  }

  async function sendReply(id: string) {
    if (!reply.trim()) return;
    setSending(true);
    const res = await fetch(`/api/contact/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    });
    if (res.ok) {
      setContacts((p) => p.map((c) => c._id === id ? { ...c, status: "replied", reply } : c));
      if (selected?._id === id) setSelected((p) => p ? { ...p, status: "replied", reply } : p);
      setReply("");
    }
    setSending(false);
  }

  async function deleteContact(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    setContacts((p) => p.filter((c) => c._id !== id));
    if (selected?._id === id) setSelected(null);
  }

  const filtered = filter === "all" ? contacts : contacts.filter((c) => c.status === filter);

  const counts = {
    all:     contacts.length,
    unread:  contacts.filter((c) => c.status === "unread").length,
    read:    contacts.filter((c) => c.status === "read").length,
    replied: contacts.filter((c) => c.status === "replied").length,
  };

  return (
    <section className="mx-auto max-w-7xl p-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Contact Messages</h1>
          <p className="mt-1 text-stone-500 text-sm">Manage and reply to user enquiries</p>
        </div>
        {counts.unread > 0 && (
          <div className="rounded-full bg-red-500 px-4 py-1.5 text-sm font-bold text-white">
            {counts.unread} unread
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "unread", "read", "replied"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide border transition-all ${
              filter === f
                ? "bg-black text-white border-black"
                : "bg-white text-stone-500 border-stone-200 hover:border-amber-400 hover:text-amber-600"
            }`}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 p-20 text-center">
          <p className="text-2xl font-semibold text-stone-400">No messages</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">

          {/* LIST */}
          <div className="space-y-3">
            {filtered.map((c) => (
              <div
                key={c._id}
                onClick={async () => {
                  setSelected(c);
                  setReply(c.reply || "");
                  if (c.status === "unread") await markRead(c._id);
                }}
                className={`cursor-pointer rounded-2xl border bg-white p-5 transition-all duration-200 hover:shadow-md hover:border-amber-200 ${
                  selected?._id === c._id ? "border-amber-400 shadow-md" : "border-stone-100"
                } ${c.status === "unread" ? "border-l-4 border-l-red-400" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-black">{c.name}</p>
                      <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyles[c.status]}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mb-2">{c.email}{c.phone ? ` · ${c.phone}` : ""}</p>
                    <p className="text-sm font-medium text-stone-700 mb-1">{c.subject}</p>
                    <p className="text-sm text-stone-500 line-clamp-2">{c.message}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[0.65rem] text-stone-400 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DETAIL PANEL */}
          {selected ? (
            <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-6 sticky top-6 h-fit">
              {/* Header */}
              <div className="flex items-start justify-between mb-5 pb-4 border-b border-stone-100">
                <div>
                  <h3 className="font-semibold text-black text-lg">{selected.name}</h3>
                  <p className="text-xs text-stone-400 mt-0.5">{selected.email}</p>
                  {selected.phone && <p className="text-xs text-stone-400">{selected.phone}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusStyles[selected.status]}`}>
                    {selected.status}
                  </span>
                  <button
                    onClick={() => deleteContact(selected._id)}
                    className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Info chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="flex items-center gap-1.5 rounded-lg bg-stone-50 border border-stone-200 px-3 py-1.5 text-xs text-stone-600">
                  <Mail size={12} className="text-amber-500" /> {selected.email}
                </span>
                {selected.phone && (
                  <span className="flex items-center gap-1.5 rounded-lg bg-stone-50 border border-stone-200 px-3 py-1.5 text-xs text-stone-600">
                    <Phone size={12} className="text-amber-500" /> {selected.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5 rounded-lg bg-stone-50 border border-stone-200 px-3 py-1.5 text-xs text-stone-600">
                  <Clock size={12} className="text-amber-500" />
                  {new Date(selected.createdAt).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Subject */}
              <p className="text-[0.62rem] font-bold uppercase tracking-widest text-amber-600 mb-1">Subject</p>
              <p className="text-sm font-semibold text-black mb-4">{selected.subject}</p>

              {/* Message */}
              <p className="text-[0.62rem] font-bold uppercase tracking-widest text-amber-600 mb-1">Message</p>
              <p className="text-sm text-stone-600 leading-relaxed bg-stone-50 rounded-xl p-4 mb-5">
                {selected.message}
              </p>

              {/* Previous reply */}
              {selected.reply && (
                <div className="mb-5 rounded-xl bg-green-50 border border-green-200 p-4">
                  <p className="text-[0.62rem] font-bold uppercase tracking-widest text-green-600 mb-1 flex items-center gap-1.5">
                    <CheckCheck size={12} /> Your Reply
                  </p>
                  <p className="text-sm text-green-800 leading-relaxed">{selected.reply}</p>
                </div>
              )}

              {/* Reply box */}
              <p className="text-[0.62rem] font-bold uppercase tracking-widest text-amber-600 mb-2">
                {selected.reply ? "Update Reply" : "Write a Reply"}
              </p>
              <textarea
                rows={4}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply here…"
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-black placeholder:text-stone-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-none mb-3 transition-all"
              />
              <button
                onClick={() => sendReply(selected._id)}
                disabled={sending || !reply.trim()}
                className="w-full rounded-full bg-black py-3 text-sm font-bold text-white flex items-center justify-center gap-2 hover:bg-[#c29b6a] hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <Reply size={15} />
                )}
                {sending ? "Sending…" : "Send Reply"}
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-200 p-12 text-center text-stone-400 sticky top-6">
              <Mail size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a message to view and reply</p>
            </div>
          )}

        </div>
      )}
    </section>
  );
}
