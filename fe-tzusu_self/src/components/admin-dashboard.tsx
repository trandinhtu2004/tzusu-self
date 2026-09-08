"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";

import styles from "./admin-dashboard.module.css";

type AdminView =
  | "overview"
  | "accounts"
  | "blog"
  | "projects"
  | "landing"
  | "media"
  | "chat";

type AccountStatus = "pending" | "active" | "banned";

interface DemoUser {
  id: number;
  name: string;
  username: string;
  email: string;
  joined: string;
  role: "member" | "admin" | null;
  status: AccountStatus;
}

const navigation: Array<{ id: AdminView; label: string; short: string }> = [
  { id: "overview", label: "Tong quan", short: "OV" },
  { id: "accounts", label: "Tai khoan", short: "AC" },
  { id: "blog", label: "Bai viet", short: "BL" },
  { id: "projects", label: "Du an", short: "PR" },
  { id: "landing", label: "Landing", short: "LA" },
  { id: "media", label: "Thu vien anh", short: "ME" },
  { id: "chat", label: "Quan ly chat", short: "CH" },
];

const initialUsers: DemoUser[] = [
  {
    id: 1,
    name: "Minh Nguyen",
    username: "minhng",
    email: "minh@example.com",
    joined: "Hom nay, 09:24",
    role: null,
    status: "pending",
  },
  {
    id: 2,
    name: "Ha Tran",
    username: "hatran",
    email: "ha@example.com",
    joined: "Hom qua, 21:08",
    role: null,
    status: "pending",
  },
  {
    id: 3,
    name: "Long Pham",
    username: "longdev",
    email: "long@example.com",
    joined: "05.09.2026",
    role: "member",
    status: "active",
  },
  {
    id: 4,
    name: "Vy Le",
    username: "vyle",
    email: "vy@example.com",
    joined: "01.09.2026",
    role: "member",
    status: "active",
  },
  {
    id: 5,
    name: "Dat Vo",
    username: "datvo",
    email: "dat@example.com",
    joined: "24.08.2026",
    role: null,
    status: "banned",
  },
];

const posts = [
  {
    title: "Tu mot API rong den luong xac thuc hoan chinh",
    category: "Build log",
    status: "Published",
    updated: "08.09.2026",
    views: "1,248",
  },
  {
    title: "Role, permission va cach toi thiet ke quyen cho chat",
    category: "Learning",
    status: "Draft",
    updated: "07.09.2026",
    views: "-",
  },
  {
    title: "Ghi lai nhung ngay binh thuong mot cach co chu dich",
    category: "Life",
    status: "Scheduled",
    updated: "05.09.2026",
    views: "-",
  },
];

const demoProjects = [
  {
    name: "Tzusu Self",
    stack: "Next.js / NestJS / MongoDB",
    progress: 62,
    status: "Dang phat trien",
  },
  {
    name: "Realtime Chat",
    stack: "WebSocket / Redis / BullMQ",
    progress: 24,
    status: "Dang thiet ke",
  },
  {
    name: "Portfolio Archive",
    stack: "Next.js / MDX",
    progress: 90,
    status: "Gan hoan thanh",
  },
];

const conversations = [
  { id: 1, name: "Long Pham", preview: "Minh vua xem bai viet moi...", time: "09:41", unread: 2 },
  { id: 2, name: "Vy Le", preview: "Cam on ban da phe duyet", time: "Hom qua", unread: 0 },
  { id: 3, name: "Ha Tran", preview: "Yeu cau quyen chat", time: "T2", unread: 0 },
];

const titles: Record<AdminView, string> = {
  overview: "Tong quan",
  accounts: "Quan ly tai khoan",
  blog: "Bai viet va blog",
  projects: "Showcase du an",
  landing: "Noi dung landing",
  media: "Thu vien hinh anh",
  chat: "Quan ly chat",
};

function StatusBadge({ status }: { status: AccountStatus }) {
  const labels: Record<AccountStatus, string> = {
    active: "Active",
    banned: "Banned",
    pending: "Pending",
  };

  return <span className={`${styles.status} ${styles[status]}`}>{labels[status]}</span>;
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(-2)
    .join("");

  return <span className={styles.avatar}>{initials}</span>;
}

export function AdminDashboard() {
  const [activeView, setActiveView] = useState<AdminView>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [users, setUsers] = useState(initialUsers);

  const pendingCount = useMemo(
    () => users.filter((user) => user.status === "pending").length,
    [users],
  );

  const changeView = (view: AdminView) => {
    setActiveView(view);
    setMenuOpen(false);
  };

  const updateAccount = (id: number, status: AccountStatus) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id
          ? {
              ...user,
              role: status === "active" ? "member" : null,
              status,
            }
          : user,
      ),
    );
  };

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHead}>
          <Link className={styles.brand} href="/">
            TZUSU<span>.SYS</span>
          </Link>
          <span className={styles.workspace}>CREATOR CMS</span>
          <button
            aria-label="Dong menu quan tri"
            className={styles.sidebarClose}
            onClick={() => setMenuOpen(false)}
            type="button"
          >
            x
          </button>
        </div>

        <nav aria-label="Khu vuc quan tri" className={styles.nav}>
          {navigation.map((item) => (
            <button
              className={activeView === item.id ? styles.navActive : ""}
              key={item.id}
              onClick={() => changeView(item.id)}
              type="button"
            >
              <span>{item.short}</span>
              {item.label}
              {item.id === "accounts" && pendingCount > 0 ? (
                <strong>{pendingCount}</strong>
              ) : null}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFoot}>
          <span className={styles.prototypeDot} />
          Prototype / Du lieu mau
        </div>
      </aside>

      <div className={styles.workspaceArea}>
        <header className={styles.topbar}>
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Dong menu quan tri" : "Mo menu quan tri"}
            className={styles.mobileMenu}
            onClick={() => setMenuOpen((current) => !current)}
            type="button"
          >
            {menuOpen ? "x" : "Menu"}
          </button>
          <div className={styles.breadcrumb}>
            <span>Tzusu Self</span>
            <strong>{titles[activeView]}</strong>
          </div>
          <div className={styles.topActions}>
            <ThemeToggle compact />
            <label className={styles.search}>
              <span>Tim</span>
              <input aria-label="Tim trong trang quan tri" placeholder="Tim kiem..." />
            </label>
            <button aria-label="Thong bao" className={styles.iconButton} type="button">
              3
            </button>
            <Avatar name="Tzusu Admin" />
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.pageHead}>
            <div>
              <p className={styles.eyebrow}>CONTROL CENTER / 2026</p>
              <h1>{titles[activeView]}</h1>
            </div>
            <div className={styles.pageActions}>
              <Link className={styles.secondaryButton} href="/">
                Xem website
              </Link>
              {activeView === "blog" ? (
                <button className={styles.primaryButton} type="button">
                  + Bai viet moi
                </button>
              ) : null}
              {activeView === "projects" ? (
                <button className={styles.primaryButton} type="button">
                  + Du an moi
                </button>
              ) : null}
              {activeView === "media" ? (
                <button className={styles.primaryButton} type="button">
                  Tai anh len
                </button>
              ) : null}
            </div>
          </div>

          {activeView === "overview" ? (
            <OverviewPanel pendingCount={pendingCount} onOpenAccounts={() => changeView("accounts")} />
          ) : null}
          {activeView === "accounts" ? (
            <AccountsPanel users={users} onUpdateAccount={updateAccount} />
          ) : null}
          {activeView === "blog" ? <BlogPanel /> : null}
          {activeView === "projects" ? <ProjectsPanel /> : null}
          {activeView === "landing" ? <LandingPanel /> : null}
          {activeView === "media" ? <MediaPanel /> : null}
          {activeView === "chat" ? (
            <ChatPanel
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}

function OverviewPanel({
  onOpenAccounts,
  pendingCount,
}: {
  onOpenAccounts: () => void;
  pendingCount: number;
}) {
  return (
    <div className={styles.panelStack}>
      <section className={styles.metrics} aria-label="So lieu tong quan">
        <article>
          <span>Tong tai khoan</span>
          <strong>128</strong>
          <small>+12 trong thang nay</small>
        </article>
        <article className={styles.metricAttention}>
          <span>Cho phe duyet</span>
          <strong>{pendingCount}</strong>
          <button onClick={onOpenAccounts} type="button">
            Xu ly ngay
          </button>
        </article>
        <article>
          <span>Bai da xuat ban</span>
          <strong>24</strong>
          <small>3 ban nhap dang viet</small>
        </article>
        <article>
          <span>Chat dang mo</span>
          <strong>07</strong>
          <small>4 tin chua doc</small>
        </article>
      </section>

      <div className={styles.overviewGrid}>
        <section className={styles.surface}>
          <div className={styles.surfaceHead}>
            <div>
              <p className={styles.sectionLabel}>Hoat dong gan day</p>
              <h2>Website trong 7 ngay</h2>
            </div>
            <span className={styles.neutralBadge}>+18.4%</span>
          </div>
          <div className={styles.chart} aria-label="Bieu do truy cap mau">
            {[42, 56, 38, 72, 64, 88, 79].map((height, index) => (
              <span key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className={styles.chartLabels}>
            <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
          </div>
        </section>

        <section className={styles.surface}>
          <div className={styles.surfaceHead}>
            <div>
              <p className={styles.sectionLabel}>Can xu ly</p>
              <h2>Hang doi cua ban</h2>
            </div>
          </div>
          <div className={styles.taskList}>
            <button onClick={onOpenAccounts} type="button">
              <span className={styles.taskMarker}>AC</span>
              <span><strong>{pendingCount} tai khoan moi</strong><small>Dang cho phe duyet</small></span>
              <b>&rarr;</b>
            </button>
            <button type="button">
              <span className={styles.taskMarker}>BL</span>
              <span><strong>2 ban nhap</strong><small>Chua dat lich dang</small></span>
              <b>&rarr;</b>
            </button>
            <button type="button">
              <span className={styles.taskMarker}>CH</span>
              <span><strong>4 tin nhan</strong><small>Chua doc</small></span>
              <b>&rarr;</b>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function AccountsPanel({
  onUpdateAccount,
  users,
}: {
  onUpdateAccount: (id: number, status: AccountStatus) => void;
  users: DemoUser[];
}) {
  const [filter, setFilter] = useState<"all" | AccountStatus>("all");
  const visibleUsers = users.filter((user) => filter === "all" || user.status === filter);

  return (
    <section className={styles.surface}>
      <div className={styles.toolbar}>
        <div className={styles.segmented} aria-label="Loc tai khoan">
          {(["all", "pending", "active", "banned"] as const).map((value) => (
            <button
              className={filter === value ? styles.segmentActive : ""}
              key={value}
              onClick={() => setFilter(value)}
              type="button"
            >
              {value === "all" ? "Tat ca" : value}
            </button>
          ))}
        </div>
        <button className={styles.secondaryButton} type="button">Bo loc</button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.dataTable}>
          <thead>
            <tr><th>Nguoi dung</th><th>Ngay tham gia</th><th>Role</th><th>Trang thai</th><th>Thao tac</th></tr>
          </thead>
          <tbody>
            {visibleUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className={styles.userCell}>
                    <Avatar name={user.name} />
                    <span><strong>{user.name}</strong><small>{user.email} / @{user.username}</small></span>
                  </div>
                </td>
                <td>{user.joined}</td>
                <td>{user.role ?? "Chua gan"}</td>
                <td><StatusBadge status={user.status} /></td>
                <td>
                  {user.status === "pending" ? (
                    <div className={styles.rowActions}>
                      <button className={styles.approveButton} onClick={() => onUpdateAccount(user.id, "active")} type="button">Duyet</button>
                      <button className={styles.rejectButton} onClick={() => onUpdateAccount(user.id, "banned")} type="button">Tu choi</button>
                    </div>
                  ) : (
                    <button className={styles.moreButton} aria-label={`Tuy chon cho ${user.name}`} type="button">...</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BlogPanel() {
  return (
    <section className={styles.surface}>
      <div className={styles.toolbar}>
        <div className={styles.segmented} aria-label="Loc bai viet">
          <button className={styles.segmentActive} type="button">Tat ca</button>
          <button type="button">Da dang</button>
          <button type="button">Ban nhap</button>
          <button type="button">Da dat lich</button>
        </div>
        <span className={styles.resultCount}>3 bai viet</span>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.dataTable}>
          <thead><tr><th>Tieu de</th><th>Danh muc</th><th>Trang thai</th><th>Luot xem</th><th>Cap nhat</th><th /></tr></thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.title}>
                <td className={styles.titleCell}>{post.title}</td>
                <td>{post.category}</td>
                <td><span className={styles.postStatus}>{post.status}</span></td>
                <td>{post.views}</td>
                <td>{post.updated}</td>
                <td><button className={styles.moreButton} aria-label={`Tuy chon cho ${post.title}`} type="button">...</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ProjectsPanel() {
  return (
    <div className={styles.projectAdminList}>
      {demoProjects.map((project, index) => (
        <article className={styles.projectAdminRow} key={project.name}>
          <span className={styles.projectNumber}>0{index + 1}</span>
          <div><h2>{project.name}</h2><p>{project.stack}</p></div>
          <span className={styles.projectState}>{project.status}</span>
          <div className={styles.progressGroup}>
            <span><b>{project.progress}%</b> hoan thanh</span>
            <div className={styles.progressTrack}><i style={{ width: `${project.progress}%` }} /></div>
          </div>
          <button className={styles.moreButton} aria-label={`Tuy chon cho ${project.name}`} type="button">...</button>
        </article>
      ))}
    </div>
  );
}

function LandingPanel() {
  return (
    <div className={styles.editorLayout}>
      <section className={styles.editorPanel}>
        <div className={styles.surfaceHead}>
          <div><p className={styles.sectionLabel}>Trang chu</p><h2>Hero section</h2></div>
          <span className={styles.savedState}>Da luu</span>
        </div>
        <label className={styles.field}>Nhan nho<input defaultValue="PERSONAL SPACE / 2026" /></label>
        <label className={styles.field}>Tieu de<input defaultValue="Tzusu." /></label>
        <label className={styles.field}>Mo ta<textarea defaultValue="Noi toi viet ve cuoc song, chia se hanh trinh lam san pham va mo mot canh cua nho de ket noi cung nhau." rows={4} /></label>
        <div className={styles.fieldGrid}>
          <label className={styles.field}>Nut chinh<input defaultValue="Doc bai moi" /></label>
          <label className={styles.field}>Nut phu<input defaultValue="Xem du an" /></label>
        </div>
        <button className={styles.primaryButton} type="button">Luu thay doi</button>
      </section>

      <section className={styles.previewPanel}>
        <div className={styles.previewHead}><span>Xem truoc</span><span>Desktop</span></div>
        <div className={styles.landingPreview}>
          <Image alt="Anh bia landing Tzusu" fill sizes="(max-width: 900px) 100vw, 50vw" src="/images/tzusu-workspace-hero.png" />
          <div className={styles.previewScrim} />
          <div className={styles.previewCopy}><small>PERSONAL SPACE / 2026</small><strong>Tzusu.</strong><p>Noi toi viet ve cuoc song va chia se hanh trinh lam san pham.</p></div>
        </div>
        <div className={styles.coverControls}>
          <div><span>Anh bia hien tai</span><strong>tzusu-workspace-hero.png</strong></div>
          <button className={styles.secondaryButton} type="button">Thay anh</button>
        </div>
      </section>
    </div>
  );
}

function MediaPanel() {
  const positions = ["50% 50%", "72% 50%", "25% 60%", "60% 25%", "40% 80%", "85% 65%"];

  return (
    <section className={styles.surface}>
      <div className={styles.toolbar}>
        <div><p className={styles.sectionLabel}>12 tep</p><h2>Gan day</h2></div>
        <div className={styles.segmented}><button className={styles.segmentActive} type="button">Luoi</button><button type="button">Danh sach</button></div>
      </div>
      <div className={styles.mediaGrid}>
        {positions.map((position, index) => (
          <article key={position}>
            <div className={styles.mediaImage}>
              <Image alt={`Anh thu vien mau ${index + 1}`} fill sizes="(max-width: 640px) 50vw, 25vw" src="/images/tzusu-workspace-hero.png" style={{ objectPosition: position }} />
              {index === 0 ? <span>Dang dung</span> : null}
            </div>
            <strong>{index === 0 ? "hero-cover.png" : `workspace-crop-0${index}.png`}</strong>
            <small>PNG / {index % 2 === 0 ? "1.7 MB" : "840 KB"}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function ChatPanel({
  onSelectConversation,
  selectedConversation,
}: {
  onSelectConversation: (id: number) => void;
  selectedConversation: number;
}) {
  const selected = conversations.find((item) => item.id === selectedConversation) ?? conversations[0];

  return (
    <div className={styles.chatLayout}>
      <aside className={styles.conversationList}>
        <div className={styles.chatListHead}><strong>Hoi thoai</strong><span>3 dang mo</span></div>
        {conversations.map((conversation) => (
          <button className={selectedConversation === conversation.id ? styles.conversationActive : ""} key={conversation.id} onClick={() => onSelectConversation(conversation.id)} type="button">
            <Avatar name={conversation.name} />
            <span><strong>{conversation.name}</strong><small>{conversation.preview}</small></span>
            <time>{conversation.time}</time>
            {conversation.unread ? <b>{conversation.unread}</b> : null}
          </button>
        ))}
        <div className={styles.requestBox}>
          <span>Yeu cau quyen chat</span><strong>05</strong><button type="button">Xem hang doi</button>
        </div>
      </aside>

      <section className={styles.messagePanel}>
        <header><div><Avatar name={selected.name} /><span><strong>{selected.name}</strong><small>Dang hoat dong</small></span></div><button className={styles.moreButton} type="button">...</button></header>
        <div className={styles.messages}>
          <time>Hom nay, 09:38</time>
          <div className={styles.incomingMessage}>Chao Tzusu, minh vua xem bai viet moi cua ban.</div>
          <div className={styles.incomingMessage}>Phan phan quyen duoc trinh bay rat de hieu.</div>
          <div className={styles.outgoingMessage}>Cam on ban. Minh van dang hoan thien no tung buoc.</div>
        </div>
        <footer><input aria-label="Nhap tin nhan" placeholder="Viet tin nhan..." /><button type="button">Gui</button></footer>
      </section>
    </div>
  );
}
