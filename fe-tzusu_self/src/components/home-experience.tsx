"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";

import { AuthDialog, AuthMode } from "@/components/auth-dialog";
import {
  motionEase,
  revealVariants,
  revealViewport,
} from "@/components/motion/motion-tokens";
import { TerminalDrawer } from "@/components/terminal-drawer";
import { ThemeToggle } from "@/components/theme-toggle";
import { apiRequest, AuthUser, checkApiHealth, UserResponse } from "@/lib/api";

const ACCESS_TOKEN_KEY = "tzusu_access_token";

const heroVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.08,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    transition: { duration: 0.65, ease: motionEase },
    y: 0,
  },
};

const projects = [
  {
    index: "01",
    name: "Tzusu Self",
    description:
      "Không gian cá nhân để viết, lưu hành trình học lập trình và giới thiệu những sản phẩm tôi đang xây dựng.",
    stack: "Next.js 16 / NestJS / MongoDB Atlas",
  },
  {
    index: "02",
    name: "Realtime Chat",
    description:
      "Kênh trò chuyện có kiểm soát quyền truy cập. Thành viên gửi yêu cầu, admin duyệt trước khi bắt đầu kết nối.",
    stack: "WebSocket / RBAC / Redis",
  },
];

const journalEntries = [
  {
    date: "08.09.2026",
    tag: "BUILD LOG",
    title: "Từ một API rỗng đến luồng xác thực hoàn chỉnh",
    excerpt:
      "Cách tôi tổ chức NestJS AuthModule, JWT payload tối giản và gắn cờ pending cho tài khoản mới đăng ký.",
  },
  {
    date: "05.09.2026",
    tag: "LEARNING",
    title: "Role, permission và cách tôi thiết kế quyền cho chat",
    excerpt:
      "Tách bạch vai trò và quyền hạn chi tiết (chat:use, chat:request) giúp quản lý truy cập an toàn và linh hoạt.",
  },
  {
    date: "01.09.2026",
    tag: "LIFE",
    title: "Ghi lại những ngày bình thường một cách có chủ đích",
    excerpt:
      "Lập trình không chỉ là code, mà là cách chúng ta xây dựng thói quen và duy trì sự tập trung dài hạn.",
  },
];

export function HomeExperience() {
  const heroRef = useRef<HTMLElement>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
    target: heroRef,
  });

  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 64]);
  const heroCopyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const closeDialog = useCallback(() => setDialogOpen(false), []);

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setDialogOpen(true);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    void checkApiHealth().then(setApiOnline);

    const accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (!accessToken) return;

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

  const canChat = user?.permissions?.includes("chat:use") ?? false;

  return (
    <div className="bg-background text-on-surface font-body-default min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* ================= TOP GLASSMORPHIC NAVBAR ================= */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-space-md md:px-gutter-desktop w-full max-w-container-max-content mx-auto bg-surface/85 backdrop-blur-md border-b border-outline-variant/30 h-16 shrink-0 transition-colors">
        <div className="flex items-center gap-space-lg">
          {/* Brand Logo & Telemetry Dot */}
          <a href="#top" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/50 flex items-center justify-center text-primary group-hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">terminal</span>
            </span>
            <span className="font-headline-sm text-headline-sm font-semibold tracking-tight text-on-surface">
              TZUSU<span className="text-tertiary">.SYS</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-space-lg font-label-ui text-label-ui">
            <a
              href="#about"
              className="text-on-surface-variant hover:text-on-surface transition-colors py-1 hover:border-b-2 hover:border-primary"
            >
              Về tôi
            </a>
            <a
              href="#projects"
              className="text-on-surface-variant hover:text-on-surface transition-colors py-1 hover:border-b-2 hover:border-primary"
            >
              Dự án
            </a>
            <a
              href="#journal"
              className="text-on-surface-variant hover:text-on-surface transition-colors py-1 hover:border-b-2 hover:border-primary"
            >
              Nhật ký
            </a>
            <a
              href="#chat"
              className="text-on-surface-variant hover:text-on-surface transition-colors py-1 hover:border-b-2 hover:border-primary"
            >
              Trò chuyện
            </a>
          </nav>
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center gap-space-xs sm:gap-space-sm">
          {/* Live Terminal Drawer Trigger */}
          <button
            onClick={() => setTerminalOpen(!terminalOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono text-xs transition-all active:scale-[0.98] ${
              terminalOpen
                ? "bg-primary text-on-primary border-primary"
                : "bg-surface-container-high text-primary border-outline-variant/40 hover:border-primary/50"
            }`}
            title="Bật/tắt Interactive Terminal Shell"
          >
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span className="hidden sm:inline">Live Terminal</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle compact />

          {/* User Auth or Session Info */}
          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <div className="hidden sm:flex flex-col items-end">
                <span className="font-label-ui text-xs font-semibold text-on-surface">
                  {user.displayName || user.username}
                </span>
                <span className="font-label-code-cap text-[10px] text-tertiary font-mono">
                  {user.role ? `[${user.role}]` : "[pending]"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1.5 rounded-lg border border-outline-variant/40 text-on-surface-variant hover:text-error hover:border-error/40 font-label-ui text-xs transition-colors"
                title="Đăng xuất"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuth("login")}
                className="px-3 py-1.5 rounded-lg border border-outline-variant/50 text-on-surface font-label-ui text-xs hover:bg-surface-variant/40 transition-colors"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => openAuth("register")}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-ui text-xs font-semibold hover:bg-primary-container transition-colors shadow-sm active:scale-95"
              >
                Đăng ký
              </button>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface border border-outline-variant/40"
            aria-label="Toggle Mobile Menu"
          >
            <span className="material-symbols-outlined text-lg">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 left-0 right-0 bg-surface-container-low/95 backdrop-blur-xl border-b border-outline-variant/30 p-space-md flex flex-col gap-3 md:hidden font-mono text-xs"
            >
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-surface-container text-on-surface"
              >
                Về tôi
              </a>
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-surface-container text-on-surface"
              >
                Dự án
              </a>
              <a
                href="#journal"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-surface-container text-on-surface"
              >
                Nhật ký
              </a>
              <a
                href="#chat"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-surface-container text-on-surface"
              >
                Trò chuyện
              </a>

              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-2 rounded-lg border border-error/40 text-error font-semibold text-center"
                >
                  Đăng xuất (@{user.username})
                </button>
              ) : (
                <div className="flex gap-2 pt-2 border-t border-outline-variant/20">
                  <button
                    onClick={() => openAuth("login")}
                    className="flex-1 py-2 rounded-lg border border-outline-variant/50 text-center"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => openAuth("register")}
                    className="flex-1 py-2 rounded-lg bg-primary text-on-primary font-semibold text-center"
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Interactive Terminal Drawer */}
      <AnimatePresence>
        {terminalOpen && (
          <TerminalDrawer
            isOpen={terminalOpen}
            onClose={() => setTerminalOpen(false)}
            user={user}
            apiOnline={apiOnline}
          />
        )}
      </AnimatePresence>

      {/* Main Canvas Body */}
      <main id="top" className="flex-grow">
        {/* ================= HERO SECTION ================= */}
        <section
          ref={heroRef}
          aria-labelledby="hero-title"
          className="relative min-h-[540px] md:min-h-[640px] flex items-center justify-center overflow-hidden border-b border-outline-variant/30"
        >
          {/* Background Workspace Hero Image with Subtle Zoom & Parallax */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: motionEase }}
            style={{ y: heroImageY }}
          >
            <Image
              src="/images/tzusu-workspace-hero.png"
              alt="Góc làm việc lập trình viên với laptop và bàn gỗ"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-75 dark:brightness-60"
            />
          </motion.div>

          {/* Ambient Scrim & Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />

          {/* Hero Content */}
          <motion.div
            className="relative z-20 max-w-3xl mx-auto px-space-md text-center flex flex-col items-center space-y-space-md"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            style={{ opacity: heroCopyOpacity }}
          >
            <motion.div
              variants={heroItemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/80 backdrop-blur-md border border-outline-variant/40 text-tertiary font-mono text-xs"
            >
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span>PERSONAL SYSTEM // 2026</span>
            </motion.div>

            <motion.h1
              id="hero-title"
              variants={heroItemVariants}
              className="font-headline-lg text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-on-surface"
            >
              Tzusu.
            </motion.h1>

            <motion.p
              variants={heroItemVariants}
              className="font-body-editorial-lg text-body-editorial-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed"
            >
              Nơi tôi viết về cuộc sống, chia sẻ hành trình làm sản phẩm và mở một cánh cửa nhỏ để kết nối cùng nhau.
            </motion.p>

            <motion.div
              variants={heroItemVariants}
              className="flex flex-wrap items-center justify-center gap-space-sm pt-space-xs font-mono text-xs"
            >
              <a
                href="#journal"
                className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-semibold hover:bg-primary transition-all glow-primary active:scale-[0.98]"
              >
                Đọc bài mới
              </a>
              <a
                href="#projects"
                className="px-5 py-2.5 rounded-xl bg-surface-container-high/80 border border-outline-variant/40 text-on-surface hover:bg-surface-container-highest transition-all"
              >
                Xem dự án
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* ================= TELEMETRY STATUS BAR ================= */}
        <div className="border-b border-outline-variant/20 bg-surface-container-lowest/90 font-mono text-xs py-2.5 px-space-md">
          <div className="max-w-container-max-content mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-outline">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  apiOnline === null
                    ? "bg-outline animate-pulse"
                    : apiOnline
                      ? "bg-tertiary animate-pulse"
                      : "bg-error"
                }`}
              />
              <span className="text-on-surface-variant">
                {apiOnline === null
                  ? "Đang kiểm tra kết nối backend..."
                  : apiOnline
                    ? "Hệ thống backend NestJS đang hoạt động"
                    : "Backend đang ngoại tuyến (offline)"}
              </span>
            </div>
            <div className="text-[11px] text-outline">
              Based in Vietnam • Available online
            </div>
          </div>
        </div>

        {/* ================= SECTION 01: VỀ TÔI ================= */}
        <motion.section
          id="about"
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={revealVariants}
          className="max-w-container-max-content mx-auto px-space-md md:px-gutter-desktop py-space-3xl border-b border-outline-variant/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xl items-start">
            <div className="md:col-span-4 space-y-1 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-tertiary border border-tertiary/20">
                01 // VỀ TÔI
              </span>
              <p className="text-outline pt-2">Bối cảnh &amp; Triết lý phát triển</p>
            </div>

            <div className="md:col-span-8 space-y-space-md">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
                Tôi xây dựng những thứ mình muốn sử dụng mỗi ngày.
              </h2>
              <p className="font-body-default text-body-default text-on-surface-variant leading-relaxed">
                Đây là nơi tổng hợp các dự án, ghi chú kỹ thuật và những câu chuyện đời thường. Một phần nội dung được mở công khai; những chia sẻ sâu hơn dành cho thành viên đã đăng ký và được xác thực qua hệ thống RBAC.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-xs font-mono text-xs">
                <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
                  <div className="text-outline text-[10px] uppercase">Focus</div>
                  <div className="text-on-surface font-semibold">Web Products &amp; Systems</div>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
                  <div className="text-outline text-[10px] uppercase">Now</div>
                  <div className="text-tertiary font-semibold">Building Tzusu Self</div>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
                  <div className="text-outline text-[10px] uppercase">Stack</div>
                  <div className="text-primary font-semibold">Next.js • NestJS • Mongo</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ================= SECTION 02: DỰ ÁN ================= */}
        <motion.section
          id="projects"
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={revealVariants}
          className="max-w-container-max-content mx-auto px-space-md md:px-gutter-desktop py-space-3xl border-b border-outline-variant/20"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm mb-space-xl">
            <div>
              <span className="font-mono text-xs text-tertiary">SELECTED WORK</span>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
                Dự án đang làm
              </h2>
            </div>
            <p className="text-outline font-mono text-xs">
              Sản phẩm thật, tiến độ thật, và cả những thứ đang học dở.
            </p>
          </div>

          <div className="space-y-space-md">
            {projects.map((project) => (
              <article
                key={project.name}
                className="group p-space-lg rounded-2xl bg-surface-container-low/90 border border-outline-variant/30 hover:border-primary/50 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-space-md shadow-sm"
              >
                <div className="flex items-start md:items-center gap-space-md">
                  <span className="font-mono text-base font-bold text-outline group-hover:text-primary transition-colors">
                    {project.index}
                  </span>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="font-body-compact text-body-compact text-on-surface-variant mt-1 max-w-2xl">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-space-md font-mono text-xs shrink-0 pt-space-xs md:pt-0 border-t md:border-t-0 border-outline-variant/20">
                  <span className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
                    {project.stack}
                  </span>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1.5 transition-all">
                    arrow_forward
                  </span>
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        {/* ================= SECTION 03: NHẬT KÝ ================= */}
        <motion.section
          id="journal"
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={revealVariants}
          className="max-w-container-max-content mx-auto px-space-md md:px-gutter-desktop py-space-3xl border-b border-outline-variant/20"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm mb-space-xl">
            <div>
              <span className="font-mono text-xs text-tertiary">JOURNAL &amp; BUILD LOGS</span>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
                Mới từ nhật ký
              </h2>
            </div>
            <p className="text-outline font-mono text-xs">
              Những ghi chú ngắn về code, kiến trúc hệ thống và cuộc sống hàng ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {journalEntries.map((entry) => (
              <article
                key={entry.title}
                className="group p-space-lg rounded-2xl bg-surface-container-low/90 border border-outline-variant/30 hover:border-primary/50 transition-all duration-200 flex flex-col justify-between space-y-space-md shadow-sm"
              >
                <div className="space-y-space-sm">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-tertiary border border-tertiary/20">
                      {entry.tag}
                    </span>
                    <time className="text-outline">{entry.date}</time>
                  </div>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                    {entry.title}
                  </h3>
                  <p className="font-body-compact text-body-compact text-on-surface-variant leading-relaxed">
                    {entry.excerpt}
                  </p>
                </div>

                <div className="pt-space-sm border-t border-outline-variant/20 flex items-center justify-between font-mono text-xs text-primary">
                  <span>Đọc tiếp</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        {/* ================= SECTION 04: TRÒ CHUYỆN RIÊNG ================= */}
        <motion.section
          id="chat"
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={revealVariants}
          className="max-w-container-max-content mx-auto px-space-md md:px-gutter-desktop py-space-3xl"
        >
          <div className="rounded-2xl bg-surface-container-low/90 border border-outline-variant/40 p-space-lg md:p-space-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

            <div className="max-w-2xl space-y-space-md">
              <span className="font-mono text-xs text-tertiary font-bold tracking-wider">
                PRIVATE CHANNEL // QUẢN LÝ QUYỀN TRUY CẬP
              </span>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                Một cuộc trò chuyện cần đúng người, đúng lúc.
              </h2>
              <p className="font-body-default text-body-default text-on-surface-variant leading-relaxed">
                Kênh chat không mở tự động cho tất cả. Mỗi thành viên gửi yêu cầu và chỉ sử dụng sau khi được admin cấp quyền <code className="text-tertiary font-mono">chat:use</code>.
              </p>

              {/* Status and Action Box */}
              <div className="pt-space-sm">
                {canChat ? (
                  <div className="p-space-md rounded-xl bg-surface-container-high border border-tertiary/40 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
                    <div className="flex items-center gap-2 text-tertiary">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Tài khoản của bạn đã được cấp quyền chat đầy đủ!</span>
                    </div>
                    <a
                      href="/admin"
                      className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-container transition-colors"
                    >
                      Mở phòng chat
                    </a>
                  </div>
                ) : user ? (
                  <div className="p-space-md rounded-xl bg-surface-container-high border border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
                    <div>
                      <div className="text-on-surface font-semibold">
                        Đang đăng nhập với @{user.username}
                      </div>
                      <p className="text-outline text-[11px] font-sans mt-0.5">
                        Quyền chat của bạn đang chờ phê duyệt hoặc chưa được cấp.
                      </p>
                    </div>
                    <button
                      disabled
                      className="px-4 py-2 rounded-lg bg-surface-container-lowest text-outline border border-outline-variant/30 cursor-not-allowed"
                    >
                      Chờ phê duyệt
                    </button>
                  </div>
                ) : (
                  <div className="p-space-md rounded-xl bg-surface-container-high border border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
                    <div>
                      <div className="text-on-surface font-semibold">
                        Chỉ dành cho thành viên đã đăng ký
                      </div>
                      <p className="text-outline text-[11px] font-sans mt-0.5">
                        Đăng nhập để xem trạng thái phê duyệt quyền chat của bạn.
                      </p>
                    </div>
                    <button
                      onClick={() => openAuth("login")}
                      className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all active:scale-[0.98]"
                    >
                      Đăng nhập ngay
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* ================= TECHNICAL FOOTER ================= */}
      <footer className="w-full py-space-xl px-space-md md:px-gutter-desktop flex flex-col md:flex-row items-center justify-between gap-space-md max-w-container-max-content mx-auto bg-surface-container-lowest border-t border-outline-variant/20 font-mono text-xs text-outline">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary" />
          <span>© 2026 Trần Đình Tú (Tzusu) • Đang xây dựng từng ngày tại Việt Nam.</span>
        </div>
        <div className="flex flex-wrap items-center gap-space-lg">
          <a
            href="https://github.com/trandinhtu2004/tzusu-self"
            target="_blank"
            rel="noreferrer"
            className="hover:text-tertiary hover:underline transition-all"
          >
            Source Code
          </a>
          <span className="text-tertiary flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
            Status: Healthy
          </span>
          <a href="/admin" className="hover:text-primary hover:underline transition-all">
            Admin Console
          </a>
        </div>
      </footer>

      {/* Modal Auth Dialog */}
      {dialogOpen ? (
        <AuthDialog
          key={authMode}
          initialMode={authMode}
          isOpen
          onAuthenticated={handleAuthenticated}
          onClose={closeDialog}
        />
      ) : null}
    </div>
  );
}
