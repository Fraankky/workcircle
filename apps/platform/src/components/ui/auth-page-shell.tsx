interface AuthPageShellProps {
  subtitle: string;
  children: React.ReactNode;
}

export function AuthPageShell({ subtitle, children }: AuthPageShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-fg tracking-tight">WorkCircle</h1>
          <p className="text-xs text-faint mt-1 uppercase tracking-widest">{subtitle}</p>
        </div>
        <div className="bg-surface rounded border border-border p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
