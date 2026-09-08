"use client";

import { FormEvent, useEffect, useState } from "react";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerForm, setRegisterForm] =
    useState<RegisterPayload>(initialRegisterForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

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
  }, [initialMode, isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setNotice("");
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
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
          : "Khong the dang nhap luc nay.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await apiRequest<UserResponse>("/auth/register", {
        body: JSON.stringify(registerForm),
        method: "POST",
      });
      setEmail(registerForm.email);
      setPassword(registerForm.password);
      setMode("login");
      setNotice("Tao tai khoan thanh cong. Dang nhap de tiep tuc.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Khong the tao tai khoan luc nay.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <section
        aria-labelledby="auth-dialog-title"
        aria-modal="true"
        className="auth-dialog"
        role="dialog"
      >
        <button
          aria-label="Dong"
          className="dialog-close"
          onClick={onClose}
          type="button"
        >
          &times;
        </button>

        <p className="eyebrow">Thanh vien Tzusu</p>
        <h2 id="auth-dialog-title">
          {mode === "login" ? "Chao mung quay lai." : "Bat dau tu day."}
        </h2>

        <div aria-label="Chon che do" className="auth-tabs" role="tablist">
          <button
            aria-selected={mode === "login"}
            className={mode === "login" ? "is-active" : ""}
            onClick={() => switchMode("login")}
            role="tab"
            type="button"
          >
            Dang nhap
          </button>
          <button
            aria-selected={mode === "register"}
            className={mode === "register" ? "is-active" : ""}
            onClick={() => switchMode("register")}
            role="tab"
            type="button"
          >
            Dang ky
          </button>
        </div>

        {notice ? <p className="form-notice">{notice}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        {mode === "login" ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              Email
              <input
                autoComplete="email"
                autoFocus
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ban@example.com"
                required
                type="email"
                value={email}
              />
            </label>
            <label>
              Mat khau
              <input
                autoComplete="current-password"
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>
            <button className="button button-primary form-submit" disabled={isSubmitting}>
              {isSubmitting ? "Dang xu ly..." : "Dang nhap"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-row">
              <label>
                Ten hien thi
                <input
                  autoComplete="name"
                  maxLength={80}
                  minLength={2}
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      displayName: event.target.value,
                    }))
                  }
                  required
                  value={registerForm.displayName}
                />
              </label>
              <label>
                Username
                <input
                  autoComplete="username"
                  maxLength={30}
                  minLength={3}
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      username: event.target.value,
                    }))
                  }
                  pattern="[A-Za-z0-9_]+"
                  required
                  value={registerForm.username}
                />
              </label>
            </div>
            <label>
              Email
              <input
                autoComplete="email"
                maxLength={254}
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                required
                type="email"
                value={registerForm.email}
              />
            </label>
            <label>
              Mat khau
              <input
                autoComplete="new-password"
                maxLength={128}
                minLength={8}
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                required
                type="password"
                value={registerForm.password}
              />
            </label>
            <button className="button button-primary form-submit" disabled={isSubmitting}>
              {isSubmitting ? "Dang xu ly..." : "Tao tai khoan"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
