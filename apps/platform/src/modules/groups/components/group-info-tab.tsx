import type { Group } from "../types";
import { CATEGORY_LABELS, CHAT_TYPE_LABELS } from "../../../lib/constants";

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
      <span className="text-faint mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] text-faint uppercase tracking-wide font-medium">{label}</p>
        <p className="text-sm text-fg font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function VibeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
