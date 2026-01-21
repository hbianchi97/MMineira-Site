import { clerkMiddleware } from '@clerk/nextjs/server'

// All routes are public during E2E tests
const publicRoutes = process.env.E2E_AUTH_BYPASS === '1' ? ['/(.*)'] : []

export default clerkMiddleware({
  publicRoutes,
})

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
