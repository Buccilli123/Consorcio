import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Consorcio",
  description: "Plataforma de gestión de consorcios",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
