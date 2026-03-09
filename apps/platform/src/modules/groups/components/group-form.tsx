import { useState, useRef } from "react";
import { useGroupForm } from "../hooks/use-group-form";
import { TagInput } from "./tag-input";
import { CATEGORY_LABELS, SCHEDULES, VIBES, CHAT_TYPE_LABELS } from "../../../lib/constants";
import { uploadImage } from "../../../lib/upload";

interface GroupFormProps {
  onSuccess: (groupId: string) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-medium text-muted uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full text-sm border border-border bg-surface-2 text-fg rounded px-3 py-2 focus:border-fg/30 focus:outline-none transition-colors placeholder-faint";

export function GroupForm({ onSuccess }: GroupFormProps) {
  const { form, set, spaces, isLoading, error, submit } = useGroupForm(onSuccess);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  async function handleCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverError(null);
    setCoverUploading(true);
    try {
      const url = await uploadImage(file, "group-cover");
      set("coverUrl")(url);
    } catch {
      setCoverError("Upload gagal, coba lagi");
    } finally {
      setCoverUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Nama Grup *">
        <input
          type="text"
          value={form.name}
          onChange={(e) => set("name")(e.target.value)}
          placeholder="Nama grup kamu"
          required
          className={inputCls}
        />
      </Field>

      <Field label="Deskripsi *">
        <textarea
          value={form.description}
          onChange={(e) => set("description")(e.target.value)}
          placeholder="Ceritakan tentang grup ini..."
          rows={3}
          required
          className={`${inputCls} resize-none`}
        />
      </Field>

      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
        <Field label="Kategori *">
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
          <select
            value={form.vibe}
            onChange={(e) => set("vibe")(e.target.value)}
            className={inputCls}
          >
            <option value="">Pilih vibe...</option>
            {VIBES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Tags (maks. 5)">
        <TagInput tags={form.tags} onChange={set("tags")} />
      </Field>

      <Field label="Lokasi (Space)">
        <select
          value={form.spaceId}
          onChange={(e) => set("spaceId")(e.target.value)}
          className={inputCls}
        >
          <option value="">Pilih space atau kosongkan</option>
          {spaces.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.area}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Jadwal *">
        <select
          value={form.schedule}
          onChange={(e) => set("schedule")(e.target.value)}
          className={inputCls}
        >
          {SCHEDULES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
        <Field label="Waktu Mulai *">
          <input
            type="time"
            value={form.timeStart}
            onChange={(e) => set("timeStart")(e.target.value)}
            required
            className={inputCls}
          />
        </Field>
        <Field label="Waktu Selesai *">
          <input
            type="time"
            value={form.timeEnd}
            onChange={(e) => set("timeEnd")(e.target.value)}
            required
            className={inputCls}
          />
        </Field>
      </div>

      <Field label={`Maksimal Anggota: ${form.maxMembers}`}>
        <input
          type="range"
          min={2}
          max={50}
          value={form.maxMembers}
          onChange={(e) => set("maxMembers")(Number(e.target.value))}
          className="w-full accent-fg"
        />
        <div className="flex justify-between text-[10px] text-faint mt-0.5">
          <span>2</span><span>50</span>
        </div>
      </Field>

      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
        <Field label="Link Grup Chat">
          <input
            type="url"
            value={form.chatLink}
            onChange={(e) => set("chatLink")(e.target.value)}
            placeholder="https://..."
            className={inputCls}
          />
        </Field>
        <Field label="Platform Chat">
          <select
            value={form.chatType}
            onChange={(e) => set("chatType")(e.target.value)}
            className={inputCls}
          >
            <option value="">Pilih platform</option>
            {Object.entries(CHAT_TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </Field>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => set("requireApproval")(!form.requireApproval)}
          className={`w-10 h-6 rounded-full transition-colors relative ${
            form.requireApproval ? "bg-fg" : "bg-border"
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-bg shadow transition-transform ${
              form.requireApproval ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-fg">Require Approval</p>
          <p className="text-xs text-faint">
            {form.requireApproval
              ? "Admin perlu menyetujui setiap anggota baru"
              : "Siapa saja bisa langsung bergabung"}
          </p>
        </div>
      </label>

      <Field label="Cover Foto (opsional)">
        <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleCoverFile} />
        {form.coverUrl ? (
          <div className="relative rounded overflow-hidden border border-border">
            <img src={form.coverUrl} alt="Cover" className="w-full h-28 object-cover" />
            <button
              type="button"
              onClick={() => set("coverUrl")("")}
              className="absolute top-2 right-2 bg-black/60 text-fg text-[10px] px-2 py-1 rounded hover:bg-black/80"
            >
              Hapus
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={coverUploading}
            onClick={() => coverInputRef.current?.click()}
            className="w-full h-24 border border-dashed border-border rounded flex flex-col items-center justify-center gap-1 text-faint hover:border-fg/30 hover:text-muted transition-colors disabled:opacity-50"
          >
            {coverUploading ? (
              <span className="text-xs">Mengupload...</span>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span className="text-xs">Klik untuk upload gambar cover</span>
                <span className="text-[10px]">1200×400 · JPEG / PNG / WebP</span>
              </>
            )}
          </button>
        )}
        {coverError && <p className="text-[10px] text-danger">{coverError}</p>}
      </Field>

      {error && <p className="text-xs text-danger">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-fg text-bg text-sm font-medium py-2.5 rounded hover:opacity-85 disabled:opacity-50 transition-all"
      >
        {isLoading ? "Membuat grup..." : "Buat Grup"}
      </button>
    </form>
  );
}
