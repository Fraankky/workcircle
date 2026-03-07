import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "../hooks";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { ApiError } from "../../../lib/api-client";

export function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    jobTitle: "",
    company: "",
    location: "",
  });

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate({ to: "/onboarding" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registrasi gagal, coba lagi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input label="Nama lengkap" placeholder="Andi Pratama" value={form.name} onChange={set("name")} required autoFocus />
      <Input label="Email" type="email" placeholder="kamu@email.com" value={form.email} onChange={set("email")} required />
      <Input label="Password" type="password" placeholder="Min. 8 karakter" value={form.password} onChange={set("password")} required minLength={8} />
      <Input label="Pekerjaan" placeholder="UI/UX Designer" value={form.jobTitle} onChange={set("jobTitle")} required />
      <Input label="Perusahaan" placeholder="Tokopedia" value={form.company} onChange={set("company")} required />
      <Input label="Kota" placeholder="Jakarta Selatan" value={form.location} onChange={set("location")} required />

      {error && (
        <p className="text-sm text-danger bg-danger-dim border border-danger/20 px-3 py-2 rounded">{error}</p>
      )}

      <Button type="submit" className="w-full mt-1" disabled={loading}>
        {loading ? "Mendaftar..." : "Daftar"}
      </Button>

      <p className="text-center text-sm text-faint">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-fg font-medium hover:underline">
          Masuk
        </Link>
      </p>
    </form>
  );
}
