"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { IconSearch, Pill, SectionCard } from "@/components/admin/admin-shell";
import { InvIconEdit, InvIconEye, InvIconX } from "@/components/admin/inventory-style-actions";

export type AdminMessageRow = {
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

function statusPillTone(status: string): "amber" | "green" | "gray" | "emerald" {
  const s = status.toLowerCase();
  if (s === "unread") return "amber";
  if (s === "replied") return "emerald";
  if (s === "read") return "gray";
  return "green";
}

export default function AdminMessagesClient() {
  const [messages, setMessages] = useState<AdminMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Messages");
  const [selectedMessage, setSelectedMessage] = useState<AdminMessageRow | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/messages");
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const filteredMessages = useMemo(() => {
    const term = search.trim().toLowerCase();
    return messages.filter((msg) => {
      const matchesSearch =
        !term ||
        msg.name.toLowerCase().includes(term) ||
        msg.email.toLowerCase().includes(term) ||
        msg.subject.toLowerCase().includes(term) ||
        msg.message.toLowerCase().includes(term);

      const st = msg.status.toLowerCase();
      let matchesStatus = true;
      if (statusFilter === "Unread") matchesStatus = st === "unread";
      else if (statusFilter === "Replied") matchesStatus = st === "replied";
      else if (statusFilter === "Read") matchesStatus = st === "read";

      return matchesSearch && matchesStatus;
    });
  }, [messages, search, statusFilter]);

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

      setMessages((prev) =>
        prev.map((m) =>
          m.id === selectedMessage.id
            ? {
                ...m,
                status: "replied",
                replyMessage: replyText.trim(),
                repliedAt: new Date().toISOString(),
              }
            : m
        )
      );

      setSelectedMessage(null);
      setReplyText("");
      alert("Response saved successfully!");
    } catch (err: unknown) {
      alert("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openMessage = (msg: AdminMessageRow) => {
    setSelectedMessage(msg);
    setReplyText(msg.replyMessage || "");
  };

  return (
    <>
      <SectionCard
        className="overflow-hidden p-4 sm:p-6"
        title="Inquiry inbox"
        subtitle="Filter by status, search across fields, and reply without leaving the admin console."
        right={
          <button type="button" className="btn btn-secondary" onClick={fetchMessages} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        }
      >
        <div className="pm-toolbar">
          <label className="pm-search w-full min-w-0">
            <IconSearch aria-hidden />
            <input
              type="text"
              className="pm-input"
              placeholder="Search name, email, subject, or message…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-3 sm:pb-4">
          {(["All Messages", "Unread", "Replied", "Read"] as const).map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setStatusFilter(label)}
              className={`rounded-md px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-[13px] font-semibold transition-colors ${
                statusFilter === label
                  ? "bg-white text-gofarm-green shadow-sm border border-gofarm-light-green/35"
                  : "bg-transparent text-gofarm-gray hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error ? (
          <div className="mb-4 rounded-[14px] border border-[#f0caca] bg-[#fff5f5] px-4 py-3 text-sm text-[#b42318]">{error}</div>
        ) : null}

        <div className="admin-data-table-shell">
          <table className="page-table min-w-[640px] sm:min-w-full w-full font-medium">
            <thead>
              <tr className="border-b border-gofarm-light-gray bg-gradient-to-r from-gray-50 to-gofarm-light-orange/50">
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.14em] text-gofarm-gray">
                  Customer
                </th>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.14em] text-gofarm-gray">
                  Inquiry
                </th>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.14em] text-gofarm-gray">
                  Status
                </th>
                <th className="page-table-col-actions w-[120px] py-2.5 sm:py-3 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.14em] text-gofarm-gray">
                  <div className="page-table-actions-head">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-gofarm-gray">
                    Loading messages…
                  </td>
                </tr>
              ) : filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-gofarm-gray">
                    No messages match your filters.
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gradient-to-r hover:from-white hover:to-gofarm-light-orange/40 transition-all duration-200"
                  >
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                      <div className="text-[12px] sm:text-[13px] font-bold text-gofarm-black">{msg.name}</div>
                      <div className="text-[10px] sm:text-[12px] text-gofarm-gray truncate max-w-[200px] sm:max-w-[280px]">{msg.email}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3 min-w-0">
                      <div className="text-[12px] sm:text-[13px] font-semibold text-gofarm-green truncate">{msg.subject}</div>
                      <div className="text-[11px] sm:text-[13px] text-gray-600 line-clamp-2 mt-0.5">{msg.message}</div>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">
                      <Pill tone={statusPillTone(msg.status)}>{msg.status.toUpperCase()}</Pill>
                    </td>
                    <td className="page-table-col-actions w-[120px] py-2.5 sm:py-3">
                      <div className="page-table-actions-cell">
                        <div className="admin-icon-actions">
                          <button
                            type="button"
                            onClick={() => openMessage(msg)}
                            className="admin-icon-actions-accent"
                            title={msg.status === "replied" ? "View / update reply" : "Reply"}
                            aria-label={msg.status === "replied" ? `View message from ${msg.name}` : `Reply to ${msg.name}`}
                          >
                            {msg.status === "replied" ? <InvIconEye /> : <InvIconEdit />}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {selectedMessage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/55 p-4 backdrop-blur-md"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedMessage(null);
          }}
        >
          <div
            className="flex max-h-[min(85vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_30px_70px_-10px_rgba(17,24,39,0.2)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-message-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-200 bg-gradient-to-b from-white to-gray-50 px-6 py-5 sm:px-8 sm:py-6">
              <div className="min-w-0">
                <h3 id="admin-message-modal-title" className="text-xl font-extrabold tracking-tight text-gofarm-black sm:text-2xl">
                  Customer inquiry
                </h3>
                <p className="mt-1 text-[13px] text-gofarm-gray">Read the thread and send a reply from the admin console.</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gofarm-green text-sm font-bold text-white">
                    {selectedMessage.name
                      .split(" ")
                      .slice(0, 2)
                      .map((p) => p[0]?.toUpperCase() ?? "")
                      .join("")
                      .slice(0, 2) || "?"}
                  </div>
                  <div className="min-w-0 text-sm">
                    <div className="font-bold text-gofarm-black truncate">{selectedMessage.name}</div>
                    <div className="truncate text-xs text-gofarm-gray">{selectedMessage.email}</div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-gray-700 ring-1 ring-gray-200 transition-all hover:bg-white hover:text-gofarm-black hover:ring-gofarm-light-green/50 active:scale-95"
                aria-label="Close"
              >
                <InvIconX />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-white px-6 py-6 sm:px-8 sm:py-8">
              <div className="mb-6 rounded-[24px] border border-gray-200 bg-gray-50 p-6">
                <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gofarm-green text-white">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <path d="m22 6-10 7L2 6" />
                    </svg>
                  </div>
                  <h4 className="text-[12px] font-bold uppercase tracking-[0.14em] text-gofarm-black">Inquiry details</h4>
                </div>
                <div className="mb-4">
                  <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gofarm-gray">Subject</div>
                  <div className="text-base font-bold text-gofarm-green sm:text-lg">{selectedMessage.subject}</div>
                </div>
                <div>
                  <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gofarm-gray">Message</div>
                  <div className="rounded-[14px] border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-gray-700">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              {selectedMessage.replyMessage ? (
                <div className="relative mb-6 pl-6 sm:pl-8">
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gofarm-green/30" aria-hidden />
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gofarm-green text-xs font-bold text-white">GF</div>
                    <span className="text-sm font-bold text-gofarm-green">Gofarm Team Response</span>
                    {selectedMessage.repliedAt ? (
                      <span className="text-[10px] text-gray-400">{new Date(selectedMessage.repliedAt).toLocaleString()}</span>
                    ) : null}
                  </div>
                  <div className="rounded-2xl border border-gofarm-green/10 bg-gofarm-green/5 p-4 text-sm leading-relaxed text-gray-800">
                    {selectedMessage.replyMessage}
                  </div>
                </div>
              ) : null}

              <div className="mb-2">
                <label htmlFor="admin-reply-textarea" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-gofarm-gray">
                  Your response
                </label>
                <textarea
                  id="admin-reply-textarea"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here…"
                  rows={5}
                  className="w-full rounded-[14px] border border-gray-200 bg-white px-4 py-3 text-sm text-gofarm-black outline-none transition-shadow placeholder:text-gray-400 focus:border-gofarm-green focus:shadow-[0_0_0_4px_rgba(0,168,68,0.12)]"
                />
              </div>
            </div>

            <div className="shrink-0 border-t border-gray-200 bg-gradient-to-b from-gray-50 to-gofarm-light-orange/30 px-6 py-5 sm:px-8">
              <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                <button type="button" className="btn btn-ghost" onClick={() => setSelectedMessage(null)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleReply}
                  disabled={isSubmitting || !replyText.trim()}
                >
                  {isSubmitting ? "Sending…" : selectedMessage.status === "replied" ? "Update response" : "Send response"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
