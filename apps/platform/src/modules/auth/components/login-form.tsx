import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "../hooks";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { ApiError } from "../../../lib/api-client";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate({ to: "/discover" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login gagal, coba lagi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="kamu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoFocus
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <p className="text-sm text-danger bg-danger-dim border border-danger/20 px-3 py-2 rounded">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Masuk..." : "Masuk"}
      </Button>

      <p className="text-center text-sm text-faint">
        Belum punya akun?{" "}
        <Link to="/register" className="text-fg font-medium hover:underline">
          Daftar
        </Link>
      </p>
    </form>
  );
}
