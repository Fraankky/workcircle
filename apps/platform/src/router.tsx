import { createRouter, createRoute, createRootRoute, redirect } from "@tanstack/react-router";
import { RootLayout } from "./routes/__root";
import { LoginPage } from "./routes/login";
import { RegisterPage } from "./routes/register";
import { DiscoverPage } from "./routes/discover/index";
import { GroupDetailPage } from "./routes/groups/$id";
import { GroupNewPage } from "./routes/groups/new";
import { SpacesPage } from "./routes/spaces/index";
import { GroupsPage } from "./routes/groups/index";
import { UpgradePage } from "./routes/upgrade/index";

// ── Root ──────────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: RootLayout });

// ── Auth pages (no sidebar) ───────────────────────────────────────────────────
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

// ── Index redirect ─────────────────────────────────────────────────────────────
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => { throw redirect({ to: "/discover" }); },
});

// ── App pages ─────────────────────────────────────────────────────────────────
const discoverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/discover",
  component: DiscoverPage,
});

const groupDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/groups/$id",
  component: GroupDetailPage,
});

const groupNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/groups/new",
  component: GroupNewPage,
});

const groupsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/groups",
  component: GroupsPage,
});

const spacesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/spaces",
  component: SpacesPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      Profile — coming soon
    </div>
  ),
});

const upgradeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upgrade",
  component: UpgradePage,
});

// ── Route tree ────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  discoverRoute,
  groupsRoute,
  groupNewRoute,
  groupDetailRoute,
  spacesRoute,
  profileRoute,
  upgradeRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
