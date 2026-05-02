"use client";

import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export default function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-sm w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gofarm-black">Share this product</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Social Media Grid */}
        <div className="p-5">
          <div className="grid grid-cols-5 gap-2">
            {/* Facebook */}
            <button
              onClick={() => openShareWindow(shareUrls.facebook)}
              className="flex flex-col items-center gap-1 p-2 bg-[#1877F2]/10 rounded-xl hover:bg-[#1877F2]/20 transition-all"
            >
              <svg className="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
              </svg>
              <span className="text-[9px] text-gray-600">Facebook</span>
            </button>

            {/* Twitter */}
            <button
              onClick={() => openShareWindow(shareUrls.twitter)}
              className="flex flex-col items-center gap-1 p-2 bg-black/5 rounded-xl hover:bg-black/10 transition-all"
            >
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-[9px] text-gray-600">Twitter</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => openShareWindow(shareUrls.whatsapp)}
              className="flex flex-col items-center gap-1 p-2 bg-[#25D366]/10 rounded-xl hover:bg-[#25D366]/20 transition-all"
            >
              <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.032 2.25c-5.382 0-9.75 4.368-9.75 9.75 0 1.715.443 3.338 1.229 4.76l-1.305 4.76 4.873-1.278c1.39.77 2.977 1.208 4.66 1.208 5.382 0 9.75-4.368 9.75-9.75s-4.368-9.75-9.75-9.75z" />
              </svg>
              <span className="text-[9px] text-gray-600">WhatsApp</span>
            </button>

            {/* Telegram */}
            <button
              onClick={() => openShareWindow(shareUrls.telegram)}
              className="flex flex-col items-center gap-1 p-2 bg-[#26A5E4]/10 rounded-xl hover:bg-[#26A5E4]/20 transition-all"
            >
              <svg className="w-6 h-6 text-[#26A5E4]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.66-.35-1.02.22-1.61.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.22-5.45 3.6-.52.36-.99.53-1.41.52-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.89.03-.24.37-.49 1.01-.75 3.96-1.73 6.6-2.86 7.92-3.4 3.77-1.54 4.56-1.81 5.07-1.82.11 0 .37.03.54.22.14.16.18.37.2.59-.02.18-.04.36-.07.53z" />
              </svg>
              <span className="text-[9px] text-gray-600">Telegram</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => openShareWindow(shareUrls.linkedin)}
              className="flex flex-col items-center gap-1 p-2 bg-[#0A66C2]/10 rounded-xl hover:bg-[#0A66C2]/20 transition-all"
            >
              <svg className="w-6 h-6 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
              </svg>
              <span className="text-[9px] text-gray-600">LinkedIn</span>
            </button>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="px-5 pb-5">
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gofarm-gray truncate">
              {url}
            </div>
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                copied 
                  ? "bg-gofarm-green text-white" 
                  : "bg-gofarm-green/10 text-gofarm-green hover:bg-gofarm-green/20"
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}