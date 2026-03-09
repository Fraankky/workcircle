import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "../../../lib/api-client";
import { qk } from "../../../lib/query-keys";
import { Modal } from "../../../components/ui/modal";
import { CATEGORY_LABELS, SCHEDULES, VIBES, CHAT_TYPE_LABELS } from "../../../lib/constants";
import { TagInput } from "./tag-input";
import type { Group } from "../types";

interface GroupEditModalProps {
  group: Group;
  groupId: string;
  open: boolean;
  onClose: () => void;
}

const inputCls =
  "w-full text-sm border border-border bg-surface-2 text-fg rounded px-3 py-2 focus:border-fg/30 focus:outline-none transition-colors placeholder-faint";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-medium text-muted uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

export function GroupEditModal({ group, groupId, open, onClose }: GroupEditModalProps) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: group.name,
    description: group.description,
    category: group.category,
    vibe: group.vibe ?? "",
    tags: group.tags as string[],
    schedule: group.schedule,
    timeStart: group.time_start,
    timeEnd: group.time_end,
    maxMembers: group.max_members,
    chatLink: group.chat_link ?? "",
    chatType: group.chat_type ?? "",
    requireApproval: group.require_approval,
  });

  const set = <K extends keyof typeof form>(key: K) =>
    (value: (typeof form)[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateMutation = useMutation({
    mutationFn: () =>
      api.patch(`/api/groups/${groupId}`, {
        name: form.name,
        description: form.description,
        category: form.category,
        vibe: form.vibe || undefined,
        tags: form.tags,
        schedule: form.schedule,
        timeStart: form.timeStart,
        timeEnd: form.timeEnd,
        maxMembers: form.maxMembers,
        chatLink: form.chatLink || undefined,
        chatType: form.chatType || undefined,
        requireApproval: form.requireApproval,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.group(groupId) });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      onClose();
    },
  });

  return (
    <Modal open={open} onClose={onClose} title="Edit Grup">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateMutation.mutate();
        }}
        className="space-y-4"
      >
        <Field label="Nama Grup *">
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name")(e.target.value)}
            required
            className={inputCls}
          />
        </Field>

        <Field label="Deskripsi *">
          <textarea
            value={form.description}
            onChange={(e) => set("description")(e.target.value)}
            rows={3}
            required
            className={`${inputCls} resize-none`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Kategori">
            <select
              value={form.category}
              onChange={(e) => set("category")(e.target.value)}
              className={inputCls}
            >
              {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Vibe">
            <select value={form.vibe} onChange={(e) => set("vibe")(e.target.value)} className={inputCls}>
              <option value="">Pilih vibe...</option>
              {VIBES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Tags">
          <TagInput tags={form.tags} onChange={set("tags")} />
        </Field>

        <Field label="Jadwal">
          <select value={form.schedule} onChange={(e) => set("schedule")(e.target.value)} className={inputCls}>
            {SCHEDULES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Mulai">
            <input type="time" value={form.timeStart} onChange={(e) => set("timeStart")(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Selesai">
            <input type="time" value={form.timeEnd} onChange={(e) => set("timeEnd")(e.target.value)} className={inputCls} />
          </Field>
        </div>

        <Field label={`Maks. Anggota: ${form.maxMembers}`}>
          <input
            type="range" min={2} max={50}
            value={form.maxMembers}
            onChange={(e) => set("maxMembers")(Number(e.target.value))}
            className="w-full accent-fg"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Link Chat">
            <input
              type="url" value={form.chatLink}
              onChange={(e) => set("chatLink")(e.target.value)}
              placeholder="https://..."
              className={inputCls}
            />
          </Field>
          <Field label="Platform">
            <select value={form.chatType} onChange={(e) => set("chatType")(e.target.value)} className={inputCls}>
              <option value="">Pilih...</option>
              {Object.entries(CHAT_TYPE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </Field>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => set("requireApproval")(!form.requireApproval)}
            className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${form.requireApproval ? "bg-fg" : "bg-border"}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-bg shadow transition-transform ${form.requireApproval ? "translate-x-5" : "translate-x-1"}`} />
          </div>
          <span className="text-sm text-fg">Require Approval</span>
        </label>

        {updateMutation.error && (
          <p className="text-xs text-danger">{String(updateMutation.error)}</p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 text-sm border border-border text-muted py-2.5 rounded hover:bg-overlay transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex-1 bg-fg text-bg text-sm font-medium py-2.5 rounded hover:opacity-85 disabled:opacity-50 transition-all"
          >
            {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
