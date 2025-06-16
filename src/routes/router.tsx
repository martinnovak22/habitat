import {
    createRootRoute,
    createRoute,
    createRouter,
    Outlet,
} from "@tanstack/react-router";

import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import HabitDetail from "../pages/HabitDetail.tsx";

const rootRoute = createRootRoute({
    component: () => <Outlet/>,
});

// Layout route: no path
const protectedLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: "protected",
    component: MainLayout,
});

// Child routes define their paths
const dashboardRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: "/",
    component: Dashboard,
});

const settingsRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: "/settings",
    component: Settings,
});

// Login stays outside the layout
const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: Login,
});

const habitDetailRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: '/habit/$habitId',
    component: HabitDetail,
});


const routeTree = rootRoute.addChildren([
    protectedLayoutRoute.addChildren([dashboardRoute, settingsRoute, habitDetailRoute]),
    loginRoute,
]);

export const router = createRouter({routeTree});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
