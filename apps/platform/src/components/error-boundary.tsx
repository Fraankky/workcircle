import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center px-4">
          <div className="w-10 h-10 rounded border border-danger/30 bg-danger-dim flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-fg">Terjadi kesalahan</p>
            <p className="text-xs text-muted mt-1 max-w-sm">
              {this.state.error?.message ?? "Halaman ini mengalami error yang tidak terduga."}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={this.reset}
              className="text-xs px-4 py-2 rounded border border-border text-muted hover:text-fg transition-colors"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-xs px-4 py-2 rounded bg-fg text-bg font-medium hover:opacity-90 transition-opacity"
            >
              Reload Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
