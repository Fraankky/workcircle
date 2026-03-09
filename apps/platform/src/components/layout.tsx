import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../modules/auth/hooks";
import { api } from "../lib/api-client";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Header } from "./header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [verifyDismissed, setVerifyDismissed] = useState(false);
  const [verifySending, setVerifySending] = useState(false);
  const [verifySent, setVerifySent] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, isLoading, navigate]);

  async function resendVerification() {
    setVerifySending(true);
    try {
      await api.post("/api/auth/verify-email", {});
      setVerifySent(true);
    } finally {
      setVerifySending(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-5 h-5 border-2 border-ascent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const showVerifyBanner = user && !user.emailVerified && !verifyDismissed;

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        {showVerifyBanner && (
          <div className="flex items-center justify-between gap-3 px-4 py-2 bg-warning-dim border-b border-warning/20 text-xs text-muted">
            <span>
              Email kamu belum diverifikasi.{" "}
              {verifySent ? (
                <span className="text-fg">Email terkirim — cek inbox kamu.</span>
              ) : (
                <button
                  onClick={resendVerification}
                  disabled={verifySending}
                  className="text-fg underline hover:no-underline disabled:opacity-50"
                >
                  {verifySending ? "Mengirim..." : "Kirim ulang email verifikasi"}
                </button>
              )}
            </span>
            <button onClick={() => setVerifyDismissed(true)} className="text-faint hover:text-fg leading-none text-base">
              ×
            </button>
          </div>
        )}
        <main className="flex-1 overflow-y-auto pt-14 pb-20 md:pt-0 md:pb-0 px-4 md:px-8 py-4 md:py-6">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
