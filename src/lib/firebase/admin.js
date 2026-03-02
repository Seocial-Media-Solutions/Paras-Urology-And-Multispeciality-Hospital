import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Initialize Firebase Admin SDK (server-side only)
 * Tries service-account.json first, then falls back to environment variables
 */
function getFirebaseAdmin() {
    if (getApps().length > 0) {
        return getApps()[0];
    }

    // Method 1: Try service-account.json file
    const serviceAccountPath = join(process.cwd(), 'service-account.json');
    if (existsSync(serviceAccountPath)) {
        try {
            const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
            return initializeApp({
                credential: cert(serviceAccount),
            });
        } catch (error) {
            console.error('Failed to load service-account.json:', error.message);
        }
    }

    // Method 2: Fall back to environment variables
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
        return initializeApp({
            credential: cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
    }

    console.error('Firebase Admin SDK: No credentials found.');
    console.error('Option 1: Place service-account.json in the project root.');
    console.error('  Download from: Firebase Console → Project Settings → Service Accounts → Generate New Private Key');
    console.error('Option 2: Set environment variables: FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY');
    throw new Error('Firebase Admin SDK credentials are missing');
}

// Initialize admin app
let adminApp;
try {
    adminApp = getFirebaseAdmin();
} catch (error) {
    console.error('Failed to initialize Firebase Admin:', error.message);
}

/**
 * Get Firebase Admin Auth instance
 */
export function getAdminAuth() {
    if (!adminApp) {
        adminApp = getFirebaseAdmin();
    }
    return getAuth(adminApp);
}

/**
 * Verify a Firebase ID token
 */
export async function verifyIdToken(idToken) {
    try {
        const auth = getAdminAuth();
        const decodedToken = await auth.verifyIdToken(idToken);
        return {
            success: true,
            uid: decodedToken.uid,
            email: decodedToken.email,
        };
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return {
            success: false,
            error: 'Invalid or expired token',
        };
    }
}

/**
 * Create a session cookie using Firebase Admin
 */
export async function createSessionCookie(idToken, expiresIn = 60 * 60 * 24 * 5 * 1000) {
    try {
        const auth = getAdminAuth();
        const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
        return {
            success: true,
            sessionCookie,
        };
    } catch (error) {
        console.error('Session cookie creation failed:', error.message);
        return {
            success: false,
            error: 'Failed to create session',
        };
    }
}

/**
 * Verify a session cookie
 */
export async function verifySessionCookie(sessionCookie) {
    try {
        const auth = getAdminAuth();
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        return {
            success: true,
            uid: decodedClaims.uid,
            email: decodedClaims.email,
        };
    } catch (error) {
        console.error('Session verification failed:', error.message);
        return {
            success: false,
            error: 'Invalid or expired session',
        };
    }
}
