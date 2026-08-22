import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NDJ Invite",
  description: "Digital invitations for your special events",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
