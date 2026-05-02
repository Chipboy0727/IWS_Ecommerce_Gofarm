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
  replyMessage?: string;
  repliedAt?: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/messages");
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/messages/${selectedMessage.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyMessage: replyText.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send response");
      }
      
      // Update local state
      setMessages(prev => prev.map(m => 
        m.id === selectedMessage.id 
          ? { ...m, status: 'replied', replyMessage: replyText.trim(), repliedAt: new Date().toISOString() } 
          : m
      ));
      
      setSelectedMessage(null);
      setReplyText("");
      alert("Response saved successfully!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
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
      <div className="rounded-[30px] border border-gofarm-light-green/40 bg-white p-6 shadow-[0_20px_60px_rgba(0,168,68,0.12)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gofarm-black">Inquiry Inbox</h2>
          <button
            onClick={fetchMessages}
            className="rounded-full border border-gofarm-green px-4 py-2 text-sm font-semibold text-gofarm-green transition hover:bg-gofarm-green hover:text-white"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-left text-[15px] sm:text-[16px]">
            <thead className="bg-gofarm-light-orange/20">
              <tr className="text-[12px] sm:text-[13px] uppercase tracking-[0.2em] text-gofarm-gray">
                <th className="px-4 sm:px-6 py-4">Customer</th>
                <th className="px-4 sm:px-6 py-4">Inquiry</th>
                <th className="px-4 sm:px-6 py-4">Status</th>
                <th className="px-4 sm:px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">Loading messages...</td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">No messages found.</td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-bold text-gofarm-black text-[16px]">{msg.name}</div>
                      <div className="text-[13px] text-gray-500 truncate max-w-[120px] sm:max-w-none">{msg.email}</div>
                      <div className="text-[12px] text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-semibold text-gofarm-green truncate max-w-[150px] sm:max-w-none text-[16px]">{msg.subject}</div>
                      <div className="text-[15px] text-gray-600 line-clamp-1">{msg.message}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`inline-block rounded-full px-2 sm:px-3 py-1 text-[11px] sm:text-[12px] font-bold whitespace-nowrap ${
                        msg.status === "unread"
                          ? "bg-amber-100 text-amber-700"
                          : msg.status === "replied"
                            ? "bg-gofarm-green/10 text-gofarm-green"
                            : "bg-gray-100 text-gofarm-gray"
                      }`}>
                        {msg.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedMessage(msg);
                          setReplyText(msg.replyMessage || "");
                        }}
                        className="rounded-full bg-gofarm-green px-3 sm:px-4 py-1.5 text-[13px] sm:text-[14px] font-bold text-white shadow-lg shadow-gofarm-green/50 transition hover:scale-105 active:scale-95 whitespace-nowrap"
                      >
                        {msg.status === 'replied' ? 'View' : 'Reply'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gofarm-black/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[30px] sm:rounded-[40px] bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-gofarm-green p-5 sm:p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-black">Customer Inquiry</h3>
                <button onClick={() => setSelectedMessage(null)} className="text-white hover:opacity-70 text-xl">✕</button>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-white/20 flex items-center justify-center text-lg sm:text-xl">👤</div>
                <div className="min-w-0">
                  <div className="font-bold truncate">{selectedMessage.name}</div>
                  <div className="text-xs sm:text-sm opacity-80 truncate">{selectedMessage.email}</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[60vh]">
              <div className="mb-5 sm:mb-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subject</label>
                <div className="mt-1 text-base sm:text-lg font-bold text-gofarm-black">{selectedMessage.subject}</div>
              </div>
              
              <div className="mb-5 sm:mb-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Message Content</label>
                <div className="mt-2 rounded-2xl bg-gray-50 p-4 text-sm sm:text-base text-gray-700 italic border border-gray-100">
                  "{selectedMessage.message}"
                </div>
              </div>

              <div className="mb-5 sm:mb-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your Response</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here..."
                  className="mt-2 w-full rounded-2xl border-2 border-gray-100 bg-white p-4 text-sm outline-none transition focus:border-gofarm-green"
                  rows={5}
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-full border border-gray-200 px-6 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={handleReply}
                  disabled={isSubmitting || !replyText.trim()}
                  className="rounded-full bg-gofarm-green px-8 py-2 text-sm font-black text-white shadow-xl shadow-gofarm-green/50 transition hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : (selectedMessage.status === 'replied' ? 'Update Response' : 'Send Response')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
