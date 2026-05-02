"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/* ── Types ────────────────────────────────────────────────── */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/* ── Markdown-lite renderer ───────────────────────────────── */
function renderMarkdown(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    // Line breaks
    .replace(/\n/g, "<br />");
}

/* ── Quick suggestion chips ───────────────────────────────── */
const SUGGESTIONS = [
  "🔥 Sản phẩm giảm giá?",
  "🚀 Sản phẩm bán chạy?",
  "💰 Giá xoài bao nhiêu?",
  "🥬 Cho xem rau củ",
];

/* ── Styles ───────────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  /* Floating button */
  fab: {
    position: "fixed",
    bottom: 24,
    right: 24,
    width: 62,
    height: 62,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2d8f4e 0%, #1a6b35 100%)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 28px rgba(45, 143, 78, 0.45), 0 2px 8px rgba(0,0,0,0.12)",
    transition: "bottom 0.35s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s",
    zIndex: 9999,
  },
  fabHover: {
    transform: "scale(1.1) rotate(8deg)",
    boxShadow: "0 8px 36px rgba(45, 143, 78, 0.55), 0 3px 12px rgba(0,0,0,0.15)",
  },
  fabPulse: {
    position: "absolute" as const,
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#ef4444",
    border: "3px solid #fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 700,
    color: "#fff",
  },

  /* Chat window container */
  container: {
    position: "fixed",
    bottom: 96,
    right: 24,
    width: 400,
    maxWidth: "calc(100vw - 32px)",
    height: 580,
    maxHeight: "calc(100vh - 120px)",
    borderRadius: 20,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)",
    zIndex: 9999,
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    background: "#f8faf9",
    transition: "opacity 0.3s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  containerOpen: {
    opacity: 1,
    transform: "translateY(0) scale(1)",
    pointerEvents: "auto" as const,
  },
  containerClosed: {
    opacity: 0,
    transform: "translateY(20px) scale(0.95)",
    pointerEvents: "none" as const,
  },

  /* Header */
  header: {
    background: "linear-gradient(135deg, #2d8f4e 0%, #1a6b35 50%, #155d2c 100%)",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    position: "relative" as const,
    overflow: "hidden",
  },
  headerPattern: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)",
    pointerEvents: "none" as const,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    flexShrink: 0,
    border: "2px solid rgba(255,255,255,0.15)",
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
    position: "relative" as const,
    zIndex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    margin: 0,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    margin: "2px 0 0",
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#4ade80",
    display: "inline-block",
    boxShadow: "0 0 6px rgba(74, 222, 128, 0.6)",
  },
  closeBtn: {
    background: "rgba(255,255,255,0.12)",
    border: "none",
    color: "#fff",
    width: 32,
    height: 32,
    borderRadius: 10,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    transition: "background 0.2s",
    position: "relative" as const,
    zIndex: 1,
    flexShrink: 0,
  },

  /* Messages area */
  messagesArea: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "16px 16px 8px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
    scrollBehavior: "smooth" as const,
  },

  /* Bubbles */
  msgRow: {
    display: "flex",
    gap: 8,
    maxWidth: "100%",
  },
  msgRowUser: {
    justifyContent: "flex-end",
  },
  msgRowBot: {
    justifyContent: "flex-start",
  },
  bubbleUser: {
    maxWidth: "78%",
    background: "linear-gradient(135deg, #2d8f4e, #1a6b35)",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "18px 18px 4px 18px",
    fontSize: 14,
    lineHeight: 1.55,
    wordBreak: "break-word" as const,
    boxShadow: "0 2px 8px rgba(45, 143, 78, 0.2)",
  },
  bubbleBot: {
    maxWidth: "85%",
    background: "#fff",
    color: "#1f2937",
    padding: "12px 16px",
    borderRadius: "18px 18px 18px 4px",
    fontSize: 14,
    lineHeight: 1.6,
    wordBreak: "break-word" as const,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    border: "1px solid rgba(0,0,0,0.04)",
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 10,
    background: "linear-gradient(135deg, #2d8f4e, #1a6b35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    flexShrink: 0,
    marginTop: 2,
  },
  msgTime: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 4,
    textAlign: "right" as const,
  },

  /* Typing indicator */
  typing: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 16px 8px",
  },
  typingDots: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "#fff",
    padding: "10px 16px",
    borderRadius: "18px 18px 18px 4px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    border: "1px solid rgba(0,0,0,0.04)",
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#2d8f4e",
  },

  /* Suggestions */
  suggestionsWrap: {
    padding: "4px 16px 12px",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 8,
  },
  suggestionChip: {
    background: "#fff",
    border: "1.5px solid #d1fae5",
    borderRadius: 20,
    padding: "7px 14px",
    fontSize: 12,
    color: "#065f46",
    cursor: "pointer",
    transition: "all 0.2s",
    fontWeight: 500,
    whiteSpace: "nowrap" as const,
  },
  suggestionChipHover: {
    background: "#d1fae5",
    borderColor: "#2d8f4e",
    transform: "translateY(-1px)",
  },

  /* Input area */
  inputArea: {
    padding: "12px 16px 16px",
    borderTop: "1px solid rgba(0,0,0,0.06)",
    background: "#fff",
    display: "flex",
    gap: 10,
    alignItems: "flex-end",
  },
  inputField: {
    flex: 1,
    border: "2px solid #e5e7eb",
    borderRadius: 16,
    padding: "10px 16px",
    fontSize: 14,
    outline: "none",
    resize: "none" as const,
    maxHeight: 100,
    lineHeight: 1.5,
    transition: "border-color 0.2s",
    fontFamily: "inherit",
    background: "#fafafa",
    color: "#1f2937",
  },
  inputFieldFocus: {
    borderColor: "#2d8f4e",
    background: "#fff",
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #2d8f4e, #1a6b35)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    flexShrink: 0,
  },
  sendBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  /* Welcome message */
  welcome: {
    textAlign: "center" as const,
    padding: "20px 16px 8px",
  },
  welcomeEmoji: {
    fontSize: 40,
    marginBottom: 8,
    display: "block",
  },
  welcomeText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.6,
    margin: 0,
  },
};

/* ── Keyframe injection ───────────────────────────────────── */
function injectKeyframes() {
  const id = "chatbox-keyframes";
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @keyframes cb-bounce-1 { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
    @keyframes cb-bounce-2 { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
    @keyframes cb-bounce-3 { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
    @keyframes cb-fade-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes cb-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(45,143,78,0.4)} 50%{box-shadow:0 0 0 12px rgba(45,143,78,0)} }
    .cb-msg-enter { animation: cb-fade-in 0.3s ease-out; }
    .cb-typing-dot-1 { animation: cb-bounce-1 1.4s infinite ease-in-out; }
    .cb-typing-dot-2 { animation: cb-bounce-2 1.4s infinite ease-in-out 0.16s; }
    .cb-typing-dot-3 { animation: cb-bounce-3 1.4s infinite ease-in-out 0.32s; }
    .cb-fab-pulse { animation: cb-pulse 2s infinite; }
    .cb-scrollbar::-webkit-scrollbar { width: 5px; }
    .cb-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .cb-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
    .cb-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
  `;
  document.head.appendChild(style);
}

/* ── Component ────────────────────────────────────────────── */
export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fabHovered, setFabHovered] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [hoveredChip, setHoveredChip] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    injectKeyframes();
  }, []);

  // Watch for toast notifications to avoid overlapping with the chat bubble
  useEffect(() => {
    const checkToast = () => {
      // Check for common toast positioning classes or sonner
      const toastEl = document.querySelector("div.fixed.bottom-4.right-4") || document.querySelector("[data-sonner-toast]");
      setToastVisible(!!toastEl);
    };

    const observer = new MutationObserver(checkToast);
    observer.observe(document.body, { childList: true, subtree: true, attributes: false });
    checkToast();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);
      setShowSuggestions(false);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        const data = await res.json();
        const botMsg: Message = {
          id: `b-${Date.now()}`,
          role: "assistant",
          content: data.reply || "Sorry, I couldn't process that request.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch {
        const errorMsg: Message = {
          id: `e-${Date.now()}`,
          role: "assistant",
          content: "⚠️ Network error. Please check your connection and try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* ── Chat Window ─────────────────────────────────── */}
      <div
        style={{
          ...styles.container,
          ...(isOpen ? styles.containerOpen : styles.containerClosed),
        }}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerPattern} />
          <div style={styles.headerAvatar}>🌿</div>
          <div style={styles.headerInfo}>
            <p style={styles.headerTitle}>Gofarm Assistant</p>
            <p style={styles.headerSubtitle}>
              <span style={styles.onlineDot} /> Online — Ready to help
            </p>
          </div>
          <button
            style={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
            }}
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div style={styles.messagesArea} className="cb-scrollbar">
          {messages.length === 0 && (
            <div style={styles.welcome}>
              <span style={styles.welcomeEmoji}>🌿</span>
              <p style={styles.welcomeText}>
                <strong>Chào mừng đến Gofarm!</strong>
                <br />
                Hỏi mình về giá, tình trạng hàng,
                <br />
                hoặc gợi ý sản phẩm nhé!
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className="cb-msg-enter"
              style={{
                ...styles.msgRow,
                ...(msg.role === "user" ? styles.msgRowUser : styles.msgRowBot),
              }}
            >
              {msg.role === "assistant" && <div style={styles.botAvatar}>🌿</div>}
              <div>
                <div
                  style={msg.role === "user" ? styles.bubbleUser : styles.bubbleBot}
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(msg.content),
                  }}
                />
                <div style={styles.msgTime}>{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={styles.typing}>
              <div style={styles.botAvatar}>🌿</div>
              <div style={styles.typingDots}>
                <div style={styles.typingDot} className="cb-typing-dot-1" />
                <div style={styles.typingDot} className="cb-typing-dot-2" />
                <div style={styles.typingDot} className="cb-typing-dot-3" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {showSuggestions && messages.length === 0 && (
          <div style={styles.suggestionsWrap}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                style={{
                  ...styles.suggestionChip,
                  ...(hoveredChip === i ? styles.suggestionChipHover : {}),
                }}
                onMouseEnter={() => setHoveredChip(i)}
                onMouseLeave={() => setHoveredChip(null)}
                onClick={() => sendMessage(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={styles.inputArea}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Type a message..."
            rows={1}
            style={{
              ...styles.inputField,
              ...(inputFocused ? styles.inputFieldFocus : {}),
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            style={{
              ...styles.sendBtn,
              ...(!input.trim() || isLoading ? styles.sendBtnDisabled : {}),
            }}
            aria-label="Send message"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2 11 13" />
              <path d="M22 2 15 22 11 13 2 9z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Floating Action Button ──────────────────────── */}
      <button
        className={!isOpen ? "cb-fab-pulse" : ""}
        style={{
          ...styles.fab,
          bottom: toastVisible && !isOpen ? 88 : 24, // Move up if toast is visible and chat is closed
          ...(fabHovered ? styles.fabHover : {}),
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setFabHovered(true)}
        onMouseLeave={() => setFabHovered(false)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18" />
            <path d="M6 6l12 12" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {!isOpen && messages.length === 0 && (
          <span style={styles.fabPulse}>!</span>
        )}
      </button>
    </>
  );
}
