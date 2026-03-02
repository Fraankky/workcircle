import { useState, useEffect } from "react";
import { useCreateGroup } from "../hooks";
import { TagInput } from "./tag-input";
import { api } from "../../../lib/api-client";
import { CATEGORY_LABELS, SCHEDULES, VIBES, CHAT_TYPE_LABELS } from "../../../lib/constants";

interface SpaceOption {
  id: string;
  name: string;
  area: string;
}

interface GroupFormProps {
  onSuccess: (groupId: string) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-medium text-[#8B949E] uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full text-sm border border-[#30363D] bg-[#1C2128] text-[#C9D1D9] rounded px-3 py-2 focus:border-[#58A6FF] focus:outline-none transition-colors placeholder-[#6E7681]";

export function GroupForm({ onSuccess }: GroupFormProps) {
  const { createGroup, isLoading, error } = useCreateGroup();
  const [spaces, setSpaces] = useState<SpaceOption[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(Object.keys(CATEGORY_LABELS)[0]);
  const [vibe, setVibe] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [spaceId, setSpaceId] = useState("");
  const [schedule, setSchedule] = useState(SCHEDULES[0]);
  const [timeStart, setTimeStart] = useState("09:00");
  const [timeEnd, setTimeEnd] = useState("12:00");
  const [maxMembers, setMaxMembers] = useState(10);
  const [chatLink, setChatLink] = useState("");
  const [chatType, setChatType] = useState("");
  const [requireApproval, setRequireApproval] = useState(true);

  useEffect(() => {
    api.list<SpaceOption>("/api/spaces")
      .then((r) => setSpaces(r.data))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const group = await createGroup({
      name,
      description,
      category,
      vibe: vibe || undefined,
      tags,
      spaceId: spaceId || undefined,
      schedule,
      timeStart,
      timeEnd,
      maxMembers,
      chatLink: chatLink || undefined,
      chatType: chatType || undefined,
      requireApproval,
    }).catch(() => null);
    if (group) onSuccess(group.id);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Nama Grup *">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama grup kamu"
          required
          className={inputCls}
        />
      </Field>

      <Field label="Deskripsi *">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ceritakan tentang grup ini..."
          rows={3}
          required
          className={`${inputCls} resize-none`}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Kategori *">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
          >
            {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </Field>

        <Field label="Vibe">
          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            className={inputCls}
          >
            <option value="">Pilih vibe...</option>
            {VIBES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Tags (maks. 5)">
        <TagInput tags={tags} onChange={setTags} />
      </Field>

      <Field label="Lokasi (Space)">
        <select
          value={spaceId}
          onChange={(e) => setSpaceId(e.target.value)}
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
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          className={inputCls}
        >
          {SCHEDULES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Waktu Mulai *">
          <input
            type="time"
            value={timeStart}
            onChange={(e) => setTimeStart(e.target.value)}
            required
            className={inputCls}
          />
        </Field>
        <Field label="Waktu Selesai *">
          <input
            type="time"
            value={timeEnd}
            onChange={(e) => setTimeEnd(e.target.value)}
            required
            className={inputCls}
          />
        </Field>
      </div>

      <Field label={`Maksimal Anggota: ${maxMembers}`}>
        <input
          type="range"
          min={2}
          max={50}
          value={maxMembers}
          onChange={(e) => setMaxMembers(Number(e.target.value))}
          className="w-full accent-[#58A6FF]"
        />
        <div className="flex justify-between text-[10px] text-[#6E7681] mt-0.5">
          <span>2</span><span>50</span>
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Link Grup Chat">
          <input
            type="url"
            value={chatLink}
            onChange={(e) => setChatLink(e.target.value)}
            placeholder="https://..."
            className={inputCls}
          />
        </Field>
        <Field label="Platform Chat">
          <select
            value={chatType}
            onChange={(e) => setChatType(e.target.value)}
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
          onClick={() => setRequireApproval(!requireApproval)}
          className={`w-10 h-6 rounded-full transition-colors relative ${
            requireApproval ? "bg-[#58A6FF]" : "bg-[#30363D]"
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              requireApproval ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-[#C9D1D9]">Require Approval</p>
          <p className="text-xs text-[#6E7681]">
            {requireApproval ? "Admin perlu menyetujui setiap anggota baru" : "Siapa saja bisa langsung bergabung"}
          </p>
        </div>
      </label>

      {error && <p className="text-xs text-[#F85149]">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#58A6FF] text-[#0D1117] text-sm font-medium py-2.5 rounded hover:bg-[#388BFD] disabled:opacity-50 transition-colors"
      >
        {isLoading ? "Membuat grup..." : "Buat Grup"}
      </button>
    </form>
  );
}
