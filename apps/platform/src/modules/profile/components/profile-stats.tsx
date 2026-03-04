interface ProfileStatsProps {
  adminCount: number;
  memberCount: number;
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface-2 rounded border border-border p-3 text-center">
      <p className="text-lg font-bold text-fg">{value}</p>
      <p className="text-[10px] text-faint uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  );
}

export function ProfileStats({ adminCount, memberCount }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
      <StatBox label="Admin" value={adminCount} />
      <StatBox label="Anggota" value={memberCount} />
      <StatBox label="Total Grup" value={adminCount + memberCount} />
    </div>
  );
}
