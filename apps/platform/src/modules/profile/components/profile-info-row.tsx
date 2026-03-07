import type { User } from "../../auth/hooks/use-auth";

type IconType = "briefcase" | "building" | "pin";

function InfoIcon({ type }: { type: IconType }) {
  if (type === "briefcase") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-faint">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    );
  }
  if (type === "building") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-faint">
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <path d="M9 22V12h6v10M9 7h1M14 7h1M9 12h1M14 12h1" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-faint">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function InfoRow({ icon, label, value }: { icon: IconType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted">
      <InfoIcon type={icon} />
      <span className="text-faint">{label}:</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

interface ProfileInfoRowProps {
  user: User;
  onEdit: () => void;
}

export function ProfileInfoRow({ user, onEdit }: ProfileInfoRowProps) {
  const hasInfo = user.bio || user.jobTitle || user.company || user.location;

  return (
    <div className="space-y-2 border-t border-border pt-4">
      {user.bio && (
        <p className="text-sm text-muted leading-relaxed">{user.bio}</p>
      )}
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-2">
        {user.jobTitle && (
          <InfoRow icon="briefcase" label="Jabatan" value={user.jobTitle} />
        )}
        {user.company && (
          <InfoRow icon="building" label="Perusahaan" value={user.company} />
        )}
        {user.location && (
          <InfoRow icon="pin" label="Lokasi" value={user.location} />
        )}
      </div>
      {!hasInfo && (
        <p className="text-xs text-faint">
          Belum ada info profil.{" "}
          <button onClick={onEdit} className="text-accent hover:underline">
            Lengkapi sekarang
          </button>
        </p>
      )}
    </div>
  );
}
