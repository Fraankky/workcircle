import { Outlet, useRouterState } from "@tanstack/react-router";
import { AuthProvider } from "../modules/auth/hooks";
import { Layout } from "../components/layout";
import { ErrorBoundary } from "../components/error-boundary";

const NO_SIDEBAR_PATHS = ["/", "/login", "/register", "/onboarding", "/forgot-password", "/reset-password", "/verify-email"];

export function RootLayout() {
  const { location } = useRouterState();
  const isAuthPage = NO_SIDEBAR_PATHS.includes(location.pathname);

  return (
    <AuthProvider>
      {/* Gradient orbs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(67,56,202,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {isAuthPage ? (
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      ) : (
        <Layout>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Layout>
      )}
    </AuthProvider>
  );
}
