import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../auth/hooks/use-auth";
import { ApiError } from "../../../lib/api-client";

export function useProfileEdit() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
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
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    saveMutation.reset();
  }

  const saveMutation = useMutation({
    mutationFn: () =>
      updateProfile({
        name: form.name || undefined,
        bio: form.bio || undefined,
        jobTitle: form.jobTitle || undefined,
        company: form.company || undefined,
        location: form.location || undefined,
      }),
    onSuccess: () => setEditing(false),
  });

  async function handleLogout() {
    await logout();
    navigate({ to: "/login" });
  }

  return {
    editing,
    busy: saveMutation.isPending,
    error: saveMutation.error instanceof ApiError
      ? saveMutation.error.message
      : saveMutation.error instanceof Error
        ? saveMutation.error.message
        : null,
    form,
    setForm,
    startEdit,
    cancelEdit,
    save: () => saveMutation.mutate(),
    handleLogout,
  };
}
