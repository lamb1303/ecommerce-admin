import { ModalProvider } from "@/providers/modal-provider";
import { ThemeProvider } from "@/providers/theme.provider";
import { ToasterProvider } from "@/providers/toast-provider";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

export const metadata: any = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ModalProvider />
            <ToasterProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
