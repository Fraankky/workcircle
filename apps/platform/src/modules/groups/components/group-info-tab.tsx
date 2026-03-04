import type { Group } from "../types";
import { CATEGORY_LABELS, CHAT_TYPE_LABELS } from "../../../lib/constants";
import { CalendarIcon, TagIcon, VibeIcon, LocationIcon, ExternalLinkIcon } from "./icons";

interface GroupInfoTabProps {
  group: Group;
}

export function GroupInfoTab({ group }: GroupInfoTabProps) {
  return (
    <div className="space-y-5">
      {/* Description */}
      <div>
        <h3 className="text-[10px] font-semibold text-faint uppercase tracking-widest mb-1.5">
          Tentang Grup
        </h3>
        <p className="text-sm text-fg leading-relaxed">{group.description}</p>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <InfoRow
          icon={<CalendarIcon />}
          label="Jadwal"
          value={`${group.schedule} · ${group.time_start}–${group.time_end}`}
        />
        <InfoRow
          icon={<TagIcon />}
          label="Kategori"
          value={CATEGORY_LABELS[group.category] ?? group.category}
        />
        {group.vibe && (
          <InfoRow icon={<VibeIcon />} label="Vibe" value={group.vibe} />
        )}
        {group.space && (
          <InfoRow
            icon={<LocationIcon />}
            label="Lokasi"
            value={`${group.space.name}, ${group.space.area}`}
          />
        )}
      </div>

      {/* Tags */}
      {group.tags.length > 0 && (
        <div>
          <h3 className="text-[10px] font-semibold text-faint uppercase tracking-widest mb-2">
            Tag
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {group.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-overlay text-xs text-muted border border-border"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Chat link */}
      {group.chat_link && (
        <div>
          <h3 className="text-[10px] font-semibold text-faint uppercase tracking-widest mb-1.5">
            Grup Chat
          </h3>
          <a
            href={group.chat_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-fg hover:underline"
          >
            <ExternalLinkIcon />
            {group.chat_type
              ? CHAT_TYPE_LABELS[group.chat_type] ?? group.chat_type
              : "Buka link"}
          </a>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded bg-surface-2 border border-border">
      <span className="text-faint mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] text-faint uppercase tracking-wide font-medium">{label}</p>
        <p className="text-sm text-fg font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}
