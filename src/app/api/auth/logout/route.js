import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'admin_session';

export async function POST() {
    try {
        // Clear the session cookie
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE_NAME, '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0, // Expire immediately
        });

        return Response.json({ success: true });
    } catch (error) {
        console.error('Logout API error:', error);
        return Response.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
