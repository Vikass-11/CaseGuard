// Minimal auth helper. No new dependency (no jwt-decode) — the JWT payload
// is just base64, so we decode it directly.

export type UserRole = 'LAWYER' | 'CASE_WORKER' | 'ADMIN';

export interface TokenPayload {
  id: string;
  role: UserRole;
  organizationId: string;
  requiresPasswordChange?: boolean;
  exp?: number;
}

const TOKEN_KEY = 'token';
const EMAIL_KEY = 'userEmail'; // stored at login time purely for display —
// the backend JWT doesn't carry name/email, so this is a display-only convenience.

export function setSession(token: string, email?: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  if (email) localStorage.setItem(EMAIL_KEY, email);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(EMAIL_KEY);
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const base64Payload = token.split('.')[1];
    const json = typeof window !== 'undefined'
      ? atob(base64Payload)
      : Buffer.from(base64Payload, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getCurrentUser(): TokenPayload | null {
  const token = getToken();
  if (!token) return null;
  const payload = decodeToken(token);
  if (!payload) return null;
  // Treat an expired token as no session at all
  if (payload.exp && Date.now() >= payload.exp * 1000) return null;
  return payload;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// This is the function the Sign Out button was missing entirely.
export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
  window.location.href = '/login';
}
