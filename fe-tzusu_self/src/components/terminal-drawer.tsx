"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { drawerVariants } from "@/components/motion/motion-tokens";
import { AuthUser, checkApiHealth } from "@/lib/api";

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  apiOnline: boolean | null;
}

interface LogEntry {
  type: "system" | "input" | "output" | "error";
  text: string;
}

export function TerminalDrawer({
  isOpen,
  onClose,
  user,
  apiOnline,
}: TerminalDrawerProps) {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: "system", text: "[sys.kernel] Initialized log buffer at 0x7FFF8A40" },
    {
      type: "system",
      text: `[auth.check] Active user: ${user ? user.username : "ANONYMOUS"} (Role: ${user?.role ?? "none"})`,
    },
    {
      type: "system",
      text: `[net.status] Backend API: ${apiOnline ? "ONLINE (200 OK)" : "PENDING/OFFLINE"}`,
    },
    { type: "system", text: "Type 'help' to inspect available system commands." },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const newLogs: LogEntry[] = [...logs, { type: "input", text: `$ ${cmd}` }];
    setInput("");

    const parts = cmd.toLowerCase().split(" ");
    const root = parts[0];

    switch (root) {
      case "help":
        newLogs.push({
          type: "output",
          text: "Commands: status, health, whoami, clear, date, ping, exit",
        });
        break;
      case "status":
        newLogs.push({
          type: "output",
          text: `Cluster: SGP-01 | Architecture: Next.js + NestJS + MongoDB | Latency: 14ms`,
        });
        break;
      case "health": {
        const isHealthy = await checkApiHealth();
        newLogs.push({
          type: "output",
          text: `Backend status: ${isHealthy ? "HEALTHY (ok)" : "UNREACHABLE"}`,
        });
        break;
      }
      case "whoami":
        if (user) {
          newLogs.push({
            type: "output",
            text: `User: ${user.displayName} (@${user.username}) | Status: ${user.status} | Permissions: [${user.permissions.join(", ")}]`,
          });
        } else {
          newLogs.push({
            type: "output",
            text: "Guest node. No active JWT session detected. Please Sign In.",
          });
        }
        break;
      case "date":
        newLogs.push({ type: "output", text: new Date().toISOString() });
        break;
      case "ping":
        newLogs.push({ type: "output", text: "PONG! 64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=1.2ms" });
        break;
      case "clear":
        setLogs([]);
        return;
      case "exit":
        onClose();
        return;
      default:
        newLogs.push({
          type: "error",
          text: `zsh: command not found: ${cmd}. Type 'help' for available commands.`,
        });
        break;
    }

    setLogs(newLogs);
  };

  if (!isOpen) return null;

  return (
    <motion.aside
      className="fixed top-16 right-3 sm:right-6 z-40 w-[94vw] sm:w-[440px] bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/60 rounded-xl shadow-2xl p-4 font-mono text-xs text-on-surface"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={drawerVariants}
    >
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 mb-3">
        <div className="flex items-center gap-2 text-tertiary">
          <span className="material-symbols-outlined text-[16px]">terminal</span>
          <span className="font-label-code-cap text-label-code-cap tracking-wider">
            tzusu.sys / live-console-v4.2
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-outline hover:text-on-surface p-1 rounded transition-colors"
          title="Close Console"
        >
          ✕
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-1 text-[11px] mb-3 pr-1 leading-relaxed">
        {logs.map((log, idx) => (
          <div
            key={idx}
            className={
              log.type === "system"
                ? "text-outline"
                : log.type === "input"
                  ? "text-primary font-semibold"
                  : log.type === "error"
                    ? "text-error"
                    : "text-tertiary"
            }
          >
            {log.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommand} className="flex items-center gap-1.5 pt-2 border-t border-outline-variant/20 text-primary">
        <span className="font-bold">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type 'help', 'status', 'health'..."
          className="bg-transparent border-none text-xs w-full text-on-surface focus:outline-none placeholder:text-outline/50 font-mono"
        />
      </form>
    </motion.aside>
  );
}
