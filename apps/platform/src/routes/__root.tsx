import { Outlet, useRouterState } from "@tanstack/react-router";
import { AuthProvider } from "../modules/auth/hooks";
import { Layout } from "../components/layout";

const AUTH_PATHS = ["/login", "/register"];

export function RootLayout() {
  const { location } = useRouterState();
  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  return (
    <AuthProvider>
      {isAuthPage ? (
        <Outlet />
      ) : (
        <Layout>
          <Outlet />
        </Layout>
      )}
    </AuthProvider>
  );
}
