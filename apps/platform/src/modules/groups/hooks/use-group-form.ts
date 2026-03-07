import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreateGroup } from "./use-create-group";
import { api } from "../../../lib/api-client";
import { qk } from "../../../lib/query-keys";
import { CATEGORY_LABELS, SCHEDULES } from "../../../lib/constants";

interface SpaceOption {
  id: string;
  name: string;
  area: string;
}

interface GroupFormState {
  name: string;
  description: string;
  category: string;
  vibe: string;
  tags: string[];
  spaceId: string;
  schedule: string;
  timeStart: string;
  timeEnd: string;
  maxMembers: number;
  chatLink: string;
  chatType: string;
  requireApproval: boolean;
}

const INITIAL_STATE: GroupFormState = {
  name: "",
  description: "",
  category: Object.keys(CATEGORY_LABELS)[0],
  vibe: "",
  tags: [],
  spaceId: "",
  schedule: SCHEDULES[0],
  timeStart: "09:00",
  timeEnd: "12:00",
  maxMembers: 10,
  chatLink: "",
  chatType: "",
  requireApproval: true,
};

export function useGroupForm(onSuccess?: (groupId: string) => void) {
  const [form, setForm] = useState<GroupFormState>(INITIAL_STATE);
  const { createGroup, isLoading, error } = useCreateGroup();

  const spacesQuery = useQuery({
    queryKey: qk.spaces(),
    queryFn: () => api.list<SpaceOption>("/api/spaces"),
    staleTime: 1000 * 60 * 5, // spaces change infrequently
  });

  const set = <K extends keyof GroupFormState>(key: K) =>
    (value: GroupFormState[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const group = await createGroup({
      name: form.name,
      description: form.description,
      category: form.category,
      vibe: form.vibe || undefined,
      tags: form.tags,
      spaceId: form.spaceId || undefined,
      schedule: form.schedule,
      timeStart: form.timeStart,
      timeEnd: form.timeEnd,
      maxMembers: form.maxMembers,
      chatLink: form.chatLink || undefined,
      chatType: form.chatType || undefined,
      requireApproval: form.requireApproval,
    }).catch(() => null);
    if (group) onSuccess?.(group.id);
  };

  return { form, set, spaces: spacesQuery.data?.data ?? [], isLoading, error, submit };
}
