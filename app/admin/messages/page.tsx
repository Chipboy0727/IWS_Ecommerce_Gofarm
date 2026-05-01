"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/messages");
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data.messages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <AdminShell
      activeHref="/admin/messages"
      title="Messages"
      subtitle="View and manage customer inquiries"
    >
      <div className="rounded-[30px] border border-gofarm-light-green/40 bg-white p-6 shadow-[0_20px_60px_rgba(16,185,129,0.10)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gofarm-black">Inquiry Inbox</h2>
          <button
            onClick={fetchMessages}
            className="rounded-full border border-gofarm-green px-4 py-2 text-sm font-semibold text-gofarm-green transition hover:bg-gofarm-green hover:text-white"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gofarm-light-orange/20">
              <tr className="text-xs uppercase tracking-[0.2em] text-gofarm-gray">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">Loading messages...</td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">No messages found.</td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gofarm-black">{msg.name}</div>
                      <div className="text-xs text-gray-500">{msg.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gofarm-green">{msg.subject}</div>
                      <div className="text-sm text-gray-600 line-clamp-1">{msg.message}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        msg.status === 'unread' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {msg.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
