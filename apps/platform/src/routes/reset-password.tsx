import { useState, type FormEvent } from "react";
import { useSearch, useNavigate, Link } from "@tanstack/react-router";
import { AuthPageShell } from "../components/ui/auth-page-shell";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { api, ApiError } from "../lib/api-client";

export function ResetPasswordPage() {
  const search = useSearch({ strict: false }) as { token?: string };
  const navigate = useNavigate();
  const token = search.token ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <AuthPageShell subtitle="Reset Password">
        <p className="text-sm text-danger text-center">Link tidak valid atau sudah kadaluarsa.</p>
        <p className="text-center mt-4">
          <Link to="/forgot-password" className="text-sm text-fg hover:underline">
            Minta link baru
          </Link>
        </p>
      </AuthPageShell>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Password tidak cocok");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", { token, newPassword: password });
      navigate({ to: "/login", search: { reset: "true" } as never });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPageShell subtitle="Buat Password Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Password Baru"
          type="password"
          placeholder="Minimal 8 karakter"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
        />
        <Input
          label="Konfirmasi Password"
          type="password"
          placeholder="Ulangi password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        {error && (
          <p className="text-sm text-danger bg-danger-dim border border-danger/20 px-3 py-2 rounded">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Password Baru"}
        </Button>
      </form>
    </AuthPageShell>
  );
}
