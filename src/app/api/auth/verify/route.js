import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'admin_session';

const getSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET is not set or too short in environment variables. Must be at least 32 characters.');
    }
    return new TextEncoder().encode(secret);
};

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

        if (!sessionCookie) {
            return Response.json(
                { authenticated: false, error: 'No session found' },
                { status: 401 }
            );
        }

        // Verify the JWT token
        try {
            const { payload } = await jwtVerify(sessionCookie, getSecretKey());

            return Response.json({
                authenticated: true,
                user: {
                    email: payload.email,
                },
            });
        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError.message);
            return Response.json(
                { authenticated: false, error: 'Invalid or expired session' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Session verify error:', error);
        return Response.json(
            { authenticated: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
