import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../auth/hooks/use-auth";
import { ApiError } from "../../../lib/api-client";

export function useProfileEdit() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    bio: user?.bio ?? "",
    jobTitle: user?.jobTitle ?? "",
    company: user?.company ?? "",
    location: user?.location ?? "",
  });

  function startEdit() {
    setForm({
      name: user?.name ?? "",
      bio: user?.bio ?? "",
      jobTitle: user?.jobTitle ?? "",
      company: user?.company ?? "",
      location: user?.location ?? "",
    });
    setError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setError(null);
  }

  async function save() {
    setBusy(true);
    setError(null);
    try {
      await updateProfile({
        name: form.name || undefined,
        bio: form.bio || undefined,
        jobTitle: form.jobTitle || undefined,
        company: form.company || undefined,
        location: form.location || undefined,
      });
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menyimpan profil");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate({ to: "/login" });
  }

  return { editing, busy, error, form, setForm, startEdit, cancelEdit, save, handleLogout };
}
