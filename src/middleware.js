import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'admin_session';
const PUBLIC_ADMIN_ROUTES = ['/admin/login'];

// Sensitive file patterns that should NEVER be accessible
const BLOCKED_PATHS = [
    /\/\.env/i,           // .env, .env.local, .env.production, etc.
    /\/\.git/i,           // .git directory
    /\/\.htaccess/i,      // Apache config
    /\/\.htpasswd/i,      // Apache passwords
    /\/\.DS_Store/i,      // macOS files
    /\/\.vscode/i,        // VS Code config
    /\/\.idea/i,          // JetBrains IDE config
    /\/\.npmrc/i,         // npm config
    /\/\.yarnrc/i,        // yarn config
    /\/wp-config/i,       // WordPress config (scanner bait)  
    /\/wp-admin/i,        // WordPress admin (scanner bait)
    /\/wp-login/i,        // WordPress login (scanner bait)
    /\/phpinfo/i,         // PHP info
    /\/\.well-known\/(?!acme-challenge)/i, // Block .well-known except ACME
    /\/server\.js$/i,     // Server files
    /\/\.bash/i,          // Bash config files
    /\/\.ssh/i,           // SSH keys
    /\/\.aws/i,           // AWS credentials
    /\/docker-compose/i,  // Docker configs
    /\/Dockerfile/i,      // Dockerfile
    /\/\.dockerignore/i,  // Docker ignore
    /\/package-lock\.json$/i,  // Package lock
    /\/yarn\.lock$/i,     // Yarn lock
    /\/\.eslintrc/i,      // ESLint config
    /\/tsconfig/i,        // TypeScript config
    /\/next\.config/i,    // Next.js config
    /\/firebase.*\.json$/i, // Firebase config files
    /\/\.firebaserc/i,    // Firebase RC
];

// Security headers applied to all responses
const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // ============================================
    // 1. BLOCK SENSITIVE FILE ACCESS
    // ============================================
    if (BLOCKED_PATHS.some(pattern => pattern.test(pathname))) {
        return new NextResponse(null, { status: 404 });
    }

    // Block directory listing attempts (common scanner patterns)
    if (pathname.endsWith('/') && pathname !== '/' && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
        // Allow normal routes, block suspicious trailing-slash probing on non-routes
    }

    // ============================================
    // 2. ADD SECURITY HEADERS TO ALL RESPONSES
    // ============================================
    let response;

    // ============================================
    // 3. ADMIN ROUTE PROTECTION
    // ============================================
    if (pathname.startsWith('/admin')) {
        const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

        // Allow public admin routes (login page)
        if (PUBLIC_ADMIN_ROUTES.includes(pathname)) {
            if (sessionCookie) {
                response = NextResponse.redirect(new URL('/admin/dashboard', request.url));
            } else {
                response = NextResponse.next();
            }
        } else if (!sessionCookie) {
            // No session → redirect to login
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            response = NextResponse.redirect(loginUrl);
        } else {
            // Cookie exists → allow through (ProtectedRoute does full verification)
            response = NextResponse.next();
        }
    } else {
        response = NextResponse.next();
    }

    // Apply security headers to every response
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

export const config = {
    matcher: [
        // Match all routes except static files and images
        '/((?!_next/static|_next/image|favicon.ico|images/).*)',
    ],
};
