"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { AuthDialog, AuthMode } from "@/components/auth-dialog";
import { apiRequest, AuthUser, checkApiHealth, UserResponse } from "@/lib/api";

const ACCESS_TOKEN_KEY = "tzusu_access_token";

const projects = [
  {
    index: "01",
    name: "Tzusu Self",
    description:
      "Khong gian ca nhan de viet, luu hanh trinh hoc lap trinh va gioi thieu nhung san pham toi dang xay dung.",
    stack: "Next.js / NestJS / MongoDB",
  },
  {
    index: "02",
    name: "Realtime Chat",
    description:
      "Kenh tro chuyen co kiem soat quyen truy cap. Thanh vien gui yeu cau, admin duyet truoc khi bat dau ket noi.",
    stack: "WebSocket / RBAC / Redis",
  },
];

const journalEntries = [
  {
    date: "08.09.2026",
    tag: "BUILD LOG",
    title: "Tu mot API rong den luong xac thuc hoan chinh",
  },
  {
    date: "05.09.2026",
    tag: "LEARNING",
    title: "Role, permission va cach toi thiet ke quyen cho chat",
  },
  {
    date: "01.09.2026",
    tag: "LIFE",
    title: "Ghi lai nhung ngay binh thuong mot cach co chu dich",
  },
];

export function HomeExperience() {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const closeDialog = useCallback(() => setDialogOpen(false), []);

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setDialogOpen(true);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    void checkApiHealth().then(setApiOnline);

    const accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (!accessToken) {
      return;
    }

    void apiRequest<UserResponse>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => sessionStorage.removeItem(ACCESS_TOKEN_KEY));
  }, []);

  const handleAuthenticated = (accessToken: string, nextUser: AuthUser) => {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    setUser(nextUser);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    setUser(null);
    setMobileMenuOpen(false);
  };

  const canChat = user?.permissions.includes("chat:use") ?? false;

  return (
    <>
      <header className="site-header">
        <a aria-label="Tzusu - ve dau trang" className="brand" href="#top">
          TZUSU<span>.</span>
        </a>

        <nav aria-label="Dieu huong chinh" className="desktop-nav">
          <a href="#about">Ve toi</a>
          <a href="#projects">Du an</a>
          <a href="#journal">Bai viet</a>
          <a href="#chat">Chat</a>
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <span className="user-greeting">Chao, {user.displayName}</span>
              <button className="text-button desktop-auth" onClick={handleLogout}>
                Dang xuat
              </button>
            </>
          ) : (
            <>
              <button
                className="text-button desktop-auth"
                onClick={() => openAuth("login")}
              >
                Dang nhap
              </button>
              <button
                className="button button-dark desktop-auth"
                onClick={() => openAuth("register")}
              >
                Dang ky
              </button>
            </>
          )}
          <button
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Dong menu" : "Mo menu"}
            className="menu-button"
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            {mobileMenuOpen ? "\u00d7" : "Menu"}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="mobile-nav">
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>
              Ve toi
            </a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)}>
              Du an
            </a>
            <a href="#journal" onClick={() => setMobileMenuOpen(false)}>
              Bai viet
            </a>
            <a href="#chat" onClick={() => setMobileMenuOpen(false)}>
              Chat
            </a>
            {user ? (
              <button className="button button-dark" onClick={handleLogout}>
                Dang xuat
              </button>
            ) : (
              <div className="mobile-auth-actions">
                <button className="button button-outline" onClick={() => openAuth("login")}>
                  Dang nhap
                </button>
                <button className="button button-dark" onClick={() => openAuth("register")}>
                  Dang ky
                </button>
              </div>
            )}
          </div>
        ) : null}
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <Image
            alt="Goc lam viec cua mot lap trinh vien voi laptop va ban go"
            className="hero-image"
            fill
            priority
            sizes="100vw"
            src="/images/tzusu-workspace-hero.png"
          />
          <div className="hero-scrim" />
          <div className="hero-content">
            <p className="eyebrow">PERSONAL SPACE / 2026</p>
            <h1 id="hero-title">Tzusu.</h1>
            <p className="hero-copy">
              Noi toi viet ve cuoc song, chia se hanh trinh lam san pham va mo mot
              canh cua nho de ket noi cung nhau.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#journal">
                Doc bai moi
              </a>
              <a className="button button-ghost" href="#projects">
                Xem du an
              </a>
            </div>
          </div>
          <a aria-label="Cuon den phan ve toi" className="scroll-cue" href="#about">
            <span />
            Kham pha
          </a>
        </section>

        <div className="status-bar">
          <div className="status-inner">
            <p>
              <span
                aria-hidden="true"
                className={`status-dot ${apiOnline === false ? "is-offline" : ""}`}
              />
              {apiOnline === null
                ? "Dang kiem tra he thong"
                : apiOnline
                  ? "He thong dang hoat dong"
                  : "Backend dang ngoai tuyen"}
            </p>
            <p>Based in Viet Nam / Available online</p>
          </div>
        </div>

        <section className="section about-section" id="about">
          <div className="section-kicker">
            <span>01</span>
            <p>Ve toi</p>
          </div>
          <div className="about-copy">
            <h2>Toi xay dung nhung thu minh muon su dung moi ngay.</h2>
            <div className="about-details">
              <p>
                Day la noi tong hop cac du an, ghi chu ky thuat va nhung cau chuyen
                doi thuong. Mot phan noi dung duoc mo cong khai; nhung chia se sau
                hon danh cho thanh vien da dang ky.
              </p>
              <dl>
                <div>
                  <dt>Focus</dt>
                  <dd>Web products</dd>
                </div>
                <div>
                  <dt>Now</dt>
                  <dd>Building Tzusu Self</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="section projects-section" id="projects">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SELECTED WORK</p>
              <h2>Du an dang lam</h2>
            </div>
            <p>San pham that, tien do that, va ca nhung thu dang hoc do.</p>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <article className="project-row" key={project.name}>
                <span className="project-index">{project.index}</span>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <span className="project-stack">{project.stack}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section journal-section" id="journal">
          <div className="section-heading">
            <div>
              <p className="eyebrow">JOURNAL</p>
              <h2>Moi tu nhat ky</h2>
            </div>
            <p>Nhung ghi chu ngan ve code, cong viec va doi song hang ngay.</p>
          </div>

          <div className="journal-grid">
            {journalEntries.map((entry, index) => (
              <article className={`journal-card journal-card-${index + 1}`} key={entry.title}>
                <div className="journal-meta">
                  <span>{entry.tag}</span>
                  <time>{entry.date}</time>
                </div>
                <h3>{entry.title}</h3>
                <button aria-label={`Doc ${entry.title}`} className="round-arrow">
                  &rarr;
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="chat-section" id="chat">
          <div className="chat-inner">
            <p className="eyebrow">PRIVATE CHANNEL</p>
            <h2>Mot cuoc tro chuyen can dung nguoi, dung luc.</h2>
            <p className="chat-description">
              Chat khong mo tu dong. Moi thanh vien gui yeu cau va chi su dung sau
              khi duoc admin cap quyen.
            </p>

            {canChat ? (
              <div className="chat-access granted">
                <span>Da duoc cap quyen</span>
                <button className="button button-light">Mo phong chat</button>
              </div>
            ) : user ? (
              <div className="chat-access">
                <div>
                  <span>Dang nhap voi @{user.username}</span>
                  <p>Quyen chat cua ban chua duoc admin phe duyet.</p>
                </div>
                <button className="button button-light" disabled>
                  Cho phe duyet
                </button>
              </div>
            ) : (
              <div className="chat-access">
                <div>
                  <span>Chi danh cho thanh vien</span>
                  <p>Dang nhap de xem trang thai quyen chat cua ban.</p>
                </div>
                <button className="button button-light" onClick={() => openAuth("login")}>
                  Dang nhap
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="#top">
          TZUSU<span>.</span>
        </a>
        <p>Dang xay dung tung ngay tai Viet Nam.</p>
        <p>&copy; 2026 Tzusu</p>
      </footer>

      {dialogOpen ? (
        <AuthDialog
          initialMode={authMode}
          isOpen
          onAuthenticated={handleAuthenticated}
          onClose={closeDialog}
        />
      ) : null}
    </>
  );
}
