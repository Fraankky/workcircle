import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AuthPageShell } from "../components/ui/auth-page-shell";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { api, ApiError } from "../lib/api-client";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <AuthPageShell subtitle="Reset Password">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 rounded border border-border bg-surface flex items-center justify-center mx-auto text-lg">
            ✉
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Jika email <span className="text-fg font-medium">{email}</span> terdaftar, link reset password telah dikirim. Cek inbox kamu.
          </p>
          <p className="text-xs text-faint">Link berlaku selama 1 jam.</p>
          <Link to="/login" className="block text-sm text-fg hover:underline mt-2">
            Kembali ke login
          </Link>
        </div>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell subtitle="Reset Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-muted leading-relaxed">
          Masukkan email yang terdaftar. Kami akan mengirim link untuk membuat password baru.
        </p>

        <Input
          label="Email"
          type="email"
          placeholder="kamu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />

        {error && (
          <p className="text-sm text-danger bg-danger-dim border border-danger/20 px-3 py-2 rounded">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Mengirim..." : "Kirim Link Reset"}
        </Button>

        <p className="text-center text-sm text-faint">
          <Link to="/login" className="text-fg hover:underline">
            Kembali ke login
          </Link>
        </p>
      </form>
    </AuthPageShell>
  );
}
