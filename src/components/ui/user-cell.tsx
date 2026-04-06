import { UserModel } from "@/types/user";

type Props = {
  user: string | UserModel | null | undefined;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserCell({ user }: Props) {
  if (!user) return <span className="text-muted-foreground text-xs">—</span>;

  if (typeof user === "string") {
    return <span className="text-muted-foreground text-xs font-mono">{user.slice(-6)}</span>;
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
        {initials(user.name)}
      </span>
      <span className="text-sm truncate max-w-[120px]">{user.name}</span>
    </div>
  );
}
