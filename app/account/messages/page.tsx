"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  replyMessage?: string;
  repliedAt?: string;
};

export default function UserMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/sign-in");
      return;
    }

    const user = JSON.parse(userData);
    fetch(`/api/user/messages?email=${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => {
        setMessages(data.messages || []);
        setLoading(false);
        
        // Mark as read when page opens
        if (data.messages?.some((m: any) => m.status === 'replied' && !m.userRead)) {
          fetch('/api/user/messages/mark-as-read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
          });
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
            <svg className="w-6 h-6 text-gofarm-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-black text-gofarm-black">Support Messages</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gofarm-green"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-[30px] p-12 text-center shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No messages yet</h2>
            <p className="text-gray-500 mb-6">When you contact us, your messages and our replies will appear here.</p>
            <div className="text-xs text-gray-300 mb-4">Logged in as: {localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").email : "Not logged in"}</div>
            <Link href="/contact" className="inline-block px-8 py-3 bg-gofarm-green text-white font-bold rounded-full hover:bg-gofarm-light-green transition-all">
              Contact Support
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-[30px] overflow-hidden shadow-sm border border-gray-100 transition-hover hover:shadow-md">
                <div className="p-6 sm:p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex gap-2 mb-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          msg.status === "replied"
                            ? "bg-gofarm-green/10 text-gofarm-green"
                            : "bg-amber-100 text-amber-600"
                        }`}>
                          {msg.status}
                        </span>
                        {msg.status === 'replied' && (msg as any).userRead !== true && (
                          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white animate-pulse">
                            New Reply
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gofarm-black">{msg.subject}</h3>
                      <p className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-6 border border-gray-100 italic text-gray-700">
                    "{msg.message}"
                  </div>

                  {msg.replyMessage ? (
                    <div className="relative pl-6 sm:pl-10">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gofarm-green rounded-full opacity-30"></div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gofarm-green flex items-center justify-center text-white text-xs font-bold">GF</div>
                        <span className="font-bold text-gofarm-green text-sm">Gofarm Team Response</span>
                        <span className="text-[10px] text-gray-400">{new Date(msg.repliedAt || "").toLocaleString()}</span>
                      </div>
                      <div className="text-gray-800 leading-relaxed bg-gofarm-green/5 p-4 rounded-2xl border border-gofarm-green/10">
                        {msg.replyMessage}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-600 text-sm font-medium bg-amber-50 p-3 rounded-xl border border-amber-100">
                      <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Waiting for Gofarm team to review...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
