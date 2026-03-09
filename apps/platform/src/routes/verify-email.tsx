import { useEffect, useState } from "react";
import { useSearch, Link } from "@tanstack/react-router";
import { AuthPageShell } from "../components/ui/auth-page-shell";

export function VerifyEmailPage() {
  const search = useSearch({ strict: false }) as { token?: string; success?: string };
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (search.success === "true") {
      setStatus("success");
      return;
    }
    if (!search.token) {
      setStatus("error");
    }
    // The backend GET /api/auth/verify-email/:token redirects here with ?success=true
    // So we only show loading briefly before redirect arrives
  }, [search]);

  if (status === "success" || search.success === "true") {
    return (
      <AuthPageShell subtitle="Verifikasi Email">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 rounded border border-border bg-surface flex items-center justify-center mx-auto text-lg">
            ✓
          </div>
          <p className="text-sm text-fg font-medium">Email berhasil diverifikasi!</p>
          <p className="text-xs text-faint">Akun kamu sekarang aktif penuh.</p>
          <Link to="/discover" className="block mt-4">
            <span className="text-sm text-fg hover:underline">Mulai Explore →</span>
          </Link>
        </div>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell subtitle="Verifikasi Email">
      <p className="text-sm text-danger text-center">Link tidak valid atau sudah kadaluarsa.</p>
      <p className="text-center mt-4">
        <Link to="/discover" className="text-sm text-fg hover:underline">
          Kembali ke app
        </Link>
      </p>
    </AuthPageShell>
  );
}
