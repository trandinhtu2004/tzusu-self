"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { modalVariants } from "@/components/motion/motion-tokens";
import {
  apiRequest,
  AuthUser,
  LoginResponse,
  RegisterPayload,
  UserResponse,
} from "@/lib/api";

export type AuthMode = "login" | "register";

interface AuthDialogProps {
  initialMode: AuthMode;
  isOpen: boolean;
  onAuthenticated: (accessToken: string, user: AuthUser) => void;
  onClose: () => void;
}

const initialRegisterForm: RegisterPayload = {
  displayName: "",
  email: "",
  password: "",
  username: "",
};

export function AuthDialog({
  initialMode,
  isOpen,
  onAuthenticated,
  onClose,
}: AuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerForm, setRegisterForm] =
    useState<RegisterPayload>(initialRegisterForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setNotice("");
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);

    try {
      const result = await apiRequest<LoginResponse>("/auth/login", {
        body: JSON.stringify({ email, password }),
        method: "POST",
      });
      onAuthenticated(result.accessToken, result.user);
      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể đăng nhập lúc này.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);

    try {
      const result = await apiRequest<UserResponse>("/auth/register", {
        body: JSON.stringify(registerForm),
        method: "POST",
      });

      setNotice(
        `Tài khoản @${result.user.username} đã được tạo với trạng thái 'pending'. Vui lòng đợi quản trị viên phê duyệt trước khi đăng nhập.`,
      );
      setMode("login");
      setEmail(registerForm.email);
      setPassword("");
      setRegisterForm(initialRegisterForm);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể đăng ký tài khoản lúc này.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-surface-dim/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Compact, clean modal card */}
        <motion.div
          className="relative z-10 w-full max-w-md rounded-2xl bg-surface-container-low/95 backdrop-blur-xl border border-outline-variant/40 shadow-2xl p-6 sm:p-7 overflow-hidden my-auto"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          {/* Subtle top primary accent line */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-surface-container-high/60 border border-outline-variant/30 flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-highest transition-colors"
            title="Đóng cửa sổ"
          >
            ✕
          </button>

          {/* Modal Header */}
          <div className="mb-5">
            <p className="font-label-code-cap text-xs text-primary font-mono tracking-wider uppercase mb-1">
              Thành viên Tzusu
            </p>
            <h2 className="font-headline-sm text-xl sm:text-2xl font-bold text-on-surface">
              {mode === "login" ? "Chào mừng quay lại." : "Bắt đầu từ đây."}
            </h2>
            <p className="font-body-compact text-xs text-on-surface-variant mt-1">
              {mode === "login"
                ? "Đăng nhập để vào không gian cá nhân và phòng thảo luận."
                : "Đăng ký tài khoản để kết nối và tham gia hệ thống."}
            </p>
          </div>

          {/* Segmented Tabs */}
          <div className="grid grid-cols-2 p-1 bg-surface-container-lowest rounded-xl border border-outline-variant/30 mb-5">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === "login"
                  ? "bg-surface-container-high text-primary shadow-sm border border-primary/20"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === "register"
                  ? "bg-surface-container-high text-primary shadow-sm border border-primary/20"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Feedback banners */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-error-container/30 border border-error/40 text-error text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          {notice && (
            <div className="mb-4 p-3 rounded-xl bg-tertiary/15 border border-tertiary/30 text-tertiary text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5">info</span>
              <span>{notice}</span>
            </div>
          )}

          {/* Form */}
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="loginEmail"
                  className="block font-label-ui text-xs text-on-surface-variant"
                >
                  Email hoặc Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-base">alternate_email</span>
                  </span>
                  <input
                    id="loginEmail"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com hoặc username"
                    autoFocus
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 bg-surface-container-lowest/80 border border-outline-variant/40 rounded-xl font-body-default text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="loginPassword"
                    className="block font-label-ui text-xs text-on-surface-variant"
                  >
                    Mật khẩu
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-base">lock</span>
                  </span>
                  <input
                    id="loginPassword"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    minLength={8}
                    className="w-full pl-9 pr-10 py-2.5 bg-surface-container-lowest/80 border border-outline-variant/40 rounded-xl font-body-default text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors"
                    title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    <span className="material-symbols-outlined text-base">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-primary text-on-primary font-label-ui text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-50 shadow-[0_0_16px_rgba(77,142,255,0.2)]"
              >
                <span>{isSubmitting ? "Đang xử lý..." : "Đăng nhập"}</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="regDisplayName"
                    className="block font-label-ui text-xs text-on-surface-variant"
                  >
                    Tên hiển thị
                  </label>
                  <input
                    id="regDisplayName"
                    type="text"
                    value={registerForm.displayName}
                    onChange={(e) =>
                      setRegisterForm((cur) => ({ ...cur, displayName: e.target.value }))
                    }
                    placeholder="Trần Đình Tú"
                    required
                    maxLength={80}
                    minLength={2}
                    className="w-full px-3 py-2 bg-surface-container-lowest/80 border border-outline-variant/40 rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="regUsername"
                    className="block font-label-ui text-xs text-on-surface-variant"
                  >
                    Username
                  </label>
                  <input
                    id="regUsername"
                    type="text"
                    value={registerForm.username}
                    onChange={(e) =>
                      setRegisterForm((cur) => ({ ...cur, username: e.target.value }))
                    }
                    placeholder="tzusu"
                    pattern="[A-Za-z0-9_]+"
                    required
                    maxLength={30}
                    minLength={3}
                    className="w-full px-3 py-2 bg-surface-container-lowest/80 border border-outline-variant/40 rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-outline font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="regEmail"
                  className="block font-label-ui text-xs text-on-surface-variant"
                >
                  Email
                </label>
                <input
                  id="regEmail"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm((cur) => ({ ...cur, email: e.target.value }))
                  }
                  placeholder="name@domain.com"
                  required
                  maxLength={254}
                  className="w-full px-3 py-2 bg-surface-container-lowest/80 border border-outline-variant/40 rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="regPassword"
                  className="block font-label-ui text-xs text-on-surface-variant"
                >
                  Mật khẩu (tối thiểu 8 ký tự)
                </label>
                <div className="relative">
                  <input
                    id="regPassword"
                    type={showPassword ? "text" : "password"}
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm((cur) => ({ ...cur, password: e.target.value }))
                    }
                    placeholder="••••••••••••"
                    required
                    minLength={8}
                    maxLength={128}
                    className="w-full pl-3 pr-9 py-2 bg-surface-container-lowest/80 border border-outline-variant/40 rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-outline hover:text-on-surface transition-colors"
                    title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container/60 border border-outline-variant/30 text-[11px] text-outline flex items-start gap-2">
                <span className="material-symbols-outlined text-sm text-tertiary shrink-0 mt-0.5">info</span>
                <span>
                  Tài khoản mới sẽ có trạng thái <strong className="text-tertiary font-mono">pending</strong> và cần được quản trị viên duyệt trước khi có thể đăng nhập.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-primary text-on-primary font-label-ui text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-50 shadow-[0_0_16px_rgba(77,142,255,0.2)]"
              >
                <span>{isSubmitting ? "Đang xử lý..." : "Đăng ký tài khoản"}</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
