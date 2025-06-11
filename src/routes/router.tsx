import {
    createRootRoute,
    createRoute,
    createRouter,
    Outlet,
} from '@tanstack/react-router';

import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Login from '../pages/Login';

const rootRoute = createRootRoute({
    component: () => <Outlet/>,
});

// Layout route: no path
const protectedLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'protected',
    component: MainLayout,
});

// Child routes define their paths
const dashboardRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: '/',
    component: Dashboard,
});

const profileRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: '/profile',
    component: Profile,
});

const settingsRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: '/settings',
    component: Settings,
});

// Login stays outside the layout
const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: Login,
});

const routeTree = rootRoute.addChildren([
    protectedLayoutRoute.addChildren([
        dashboardRoute,
        profileRoute,
        settingsRoute,
    ]),
    loginRoute,
]);

export const router = createRouter({routeTree});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
