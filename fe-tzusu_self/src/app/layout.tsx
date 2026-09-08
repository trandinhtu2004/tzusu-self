import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tzusu | Personal space",
  description:
    "Khong gian ca nhan cua Tzusu: bai viet, du an va kenh tro chuyen rieng.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
