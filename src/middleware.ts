import { clerkMiddleware } from '@clerk/nextjs/server'

// All routes are public during E2E tests
const publicRoutes = process.env.E2E_AUTH_BYPASS === '1' ? ['/(.*)'] : ['/', '/api/health', '/api/checkout', '/api/webhooks/clerk', '/produto/(.*)', '/categoria/(.*)', '/novidades/(.*)']

export default clerkMiddleware((auth, req) => {
    const { nextUrl } = req;
    const isPublicRoute = publicRoutes.some(route => {
        if (route === '/') return nextUrl.pathname === '/';
        const regex = new RegExp(`^${route.replace('(.*)', '.*')}$`);
        return regex.test(nextUrl.pathname);
    });

    if (!isPublicRoute) {
        // auth().protect()  // If you want to protect all other routes
    }
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
