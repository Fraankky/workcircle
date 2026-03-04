import { Link } from "@tanstack/react-router";
import { useMyGroups } from "../../modules/groups/hooks/use-my-groups";
import { GroupCard } from "../../modules/groups/components/group-card";
import { GroupCardSkeleton } from "../../components/ui/skeleton";
import { Badge } from "../../components/ui/badge";
import { PageHeader } from "../../components/ui/page-header";
import { ErrorState } from "../../components/ui/error-state";
import type { Group } from "../../modules/groups/types";

export function GroupsPage() {
  const { admin_groups, member_groups, isLoading, error } = useMyGroups();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-overlay animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <GroupCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) return <ErrorState message={error} padding="py-20" />;

  return (
    <div className="space-y-8 p-6">
      <PageHeader title="Grup Saya" subtitle="Grup yang kamu admin dan ikuti">
        <Link to="/discover" className="text-xs text-fg hover:underline">
          Jelajahi grup
        </Link>
      </PageHeader>

      <GroupSection
        title="Grup yang Kamu Admin"
        groups={admin_groups}
        badge={<Badge variant="approved">Admin</Badge>}
        emptyText="Kamu belum membuat grup."
        emptyCta={{ label: "Buat Grup", to: "/groups/new" }}
      />

      <GroupSection
        title="Grup yang Kamu Ikuti"
        groups={member_groups}
        emptyText="Kamu belum bergabung ke grup manapun."
        emptyCta={{ label: "Temukan Grup", to: "/discover" }}
      />
    </div>
  );
}

function GroupSection({
  title,
  groups,
  badge,
  emptyText,
  emptyCta,
}: {
  title: string;
  groups: Group[];
  badge?: React.ReactNode;
  emptyText: string;
  emptyCta: { label: string; to: string };
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-muted">{title}</h2>
        {badge}
        <span className="text-xs text-faint ml-auto">{groups.length} grup</span>
      </div>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border rounded">
          <p className="text-sm text-faint">{emptyText}</p>
          <Link
            to={emptyCta.to}
            className="mt-2 text-xs text-fg font-medium hover:underline"
          >
            {emptyCta.label}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </section>
  );
}
