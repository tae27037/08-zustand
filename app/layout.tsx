import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "NoteHub app",
};

type Props = {
  children: ReactNode;
  modal: ReactNode;
};

export default function RootLayout({ children, modal }: Props) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
