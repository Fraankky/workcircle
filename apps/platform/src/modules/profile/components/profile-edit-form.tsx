interface FormState {
  name: string;
  bio: string;
  jobTitle: string;
  company: string;
  location: string;
}

interface ProfileEditFormProps {
  form: FormState;
  onChange: (form: FormState) => void;
  error: string | null;
  busy: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const cls =
  "w-full text-sm border border-border bg-surface-2 text-fg rounded px-3 py-2 focus:border-fg/30 focus:outline-none transition-colors placeholder-faint";

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] font-medium text-muted uppercase tracking-widest block mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${cls} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  );
}

export function ProfileEditForm({ form, onChange, error, busy, onSave, onCancel }: ProfileEditFormProps) {
  const set = (key: keyof FormState) => (v: string) => onChange({ ...form, [key]: v });

  return (
    <div className="bg-surface rounded border border-border p-6 space-y-4">
      <h2 className="text-sm font-semibold text-fg">Edit Profil</h2>

      {error && (
        <p className="text-xs text-danger bg-danger/10 border border-danger/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      <div className="space-y-3">
        <Field label="Nama" value={form.name} onChange={set("name")} placeholder="Nama lengkap" />
        <Field label="Bio" value={form.bio} onChange={set("bio")} placeholder="Ceritakan sedikit tentang kamu" multiline />
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
          <Field label="Jabatan" value={form.jobTitle} onChange={set("jobTitle")} placeholder="Software Engineer" />
          <Field label="Perusahaan" value={form.company} onChange={set("company")} placeholder="PT. Contoh Indonesia" />
        </div>
        <Field label="Lokasi" value={form.location} onChange={set("location")} placeholder="Jakarta, Indonesia" />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={onSave}
          disabled={busy || !form.name.trim()}
          className="flex-1 bg-fg text-bg text-sm font-medium py-2.5 rounded hover:opacity-85 disabled:opacity-50 transition-all"
        >
          {busy ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          onClick={onCancel}
          disabled={busy}
          className="px-4 text-sm text-muted border border-border rounded hover:bg-overlay hover:text-fg transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
