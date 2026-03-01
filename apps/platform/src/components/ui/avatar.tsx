import { cn, getInitials } from "../../lib/utils";

const sizes = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
} as const;

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: keyof typeof sizes;
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover flex-shrink-0", sizes[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "rounded-full bg-indigo-100 text-indigo-600 font-semibold flex items-center justify-center flex-shrink-0",
        sizes[size],
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}

interface AvatarGroupProps {
  users: { name: string; avatarUrl?: string | null }[];
  max?: number;
}

export function AvatarGroup({ users, max = 3 }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const rest = users.length - max;

  return (
    <div className="flex">
      {visible.map((u, i) => (
        <div key={i} className="-ml-2 first:ml-0 ring-2 ring-white rounded-full">
          <Avatar src={u.avatarUrl} name={u.name} size="xs" />
        </div>
      ))}
      {rest > 0 && (
        <div className="-ml-2 w-6 h-6 rounded-full bg-gray-100 ring-2 ring-white text-[10px] font-semibold text-gray-500 flex items-center justify-center">
          +{rest}
        </div>
      )}
    </div>
  );
}
