import { createRouter, createRoute, createRootRoute, redirect } from "@tanstack/react-router";
import { RootLayout } from "./routes/__root";
import { LoginPage } from "./routes/login";
import { RegisterPage } from "./routes/register";
import { ForgotPasswordPage } from "./routes/forgot-password";
import { ResetPasswordPage } from "./routes/reset-password";
import { VerifyEmailPage } from "./routes/verify-email";
import { DiscoverPage } from "./routes/discover/index";
import { GroupDetailPage } from "./routes/groups/$id";
import { GroupNewPage } from "./routes/groups/new";
import { SpacesPage } from "./routes/spaces/index";
import { SpaceDetailPage } from "./routes/spaces/$id";
import { GroupsPage } from "./routes/groups/index";
import { UpgradePage } from "./routes/upgrade/index";
import { ProfilePage } from "./routes/profile/index";
import { OnboardingPage } from "./routes/onboarding/index";

// ── Root ──────────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: RootLayout });

// ── Auth / no-sidebar pages ───────────────────────────────────────────────────
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

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: OnboardingPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: ForgotPasswordPage,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: ResetPasswordPage,
});

const verifyEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify-email",
  component: VerifyEmailPage,
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

const spaceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/spaces/$id",
  component: SpaceDetailPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
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
  onboardingRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  verifyEmailRoute,
  discoverRoute,
  groupsRoute,
  groupNewRoute,
  groupDetailRoute,
  spacesRoute,
  spaceDetailRoute,
  profileRoute,
  upgradeRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
