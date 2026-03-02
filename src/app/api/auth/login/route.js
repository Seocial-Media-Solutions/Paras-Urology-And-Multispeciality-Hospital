import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 60 * 60 * 24 * 5; // 5 days in seconds

// Use the secret from environment variables
const getSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET is not set or too short in environment variables. Must be at least 32 characters.');
    }
    return new TextEncoder().encode(secret);
};

export async function POST(request) {
    // Rate limit: max 5 login attempts per 15 minutes per IP
    const limiter = rateLimit(request, {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000,
        keyPrefix: 'login',
    });

    if (!limiter.success) {
        return rateLimitResponse(limiter.retryAfter);
    }

    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return Response.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Get hardcoded credentials from environment variables
        const validEmail = process.env.ADMIN_EMAIL;
        const validPassword = process.env.ADMIN_PASSWORD;

        if (!validEmail || !validPassword) {
            console.error('ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables');
            return Response.json(
                { success: false, error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Verify credentials
        if (email !== validEmail || password !== validPassword) {
            return Response.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Create JWT token using jose
        const token = await new SignJWT({ email, role: 'admin' })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(`${SESSION_DURATION}s`)
            .sign(getSecretKey());

        // Set HttpOnly, Secure, SameSite cookie
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: SESSION_DURATION, // in seconds
        });

        return Response.json({
            success: true,
            user: {
                email: email,
            },
        });
    } catch (error) {
        console.error('Login API error:', error);
        return Response.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
