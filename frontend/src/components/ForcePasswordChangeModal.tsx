'use client';
import { useEffect, useState } from 'react';
import { getCurrentUser, setSession, logout } from '@/lib/auth';
import api from '@/lib/api';
import { usePathname } from 'next/navigation';

export default function ForcePasswordChangeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Don't show on login page
    if (pathname === '/login') return;

    const user = getCurrentUser();
    if (user && user.requiresPasswordChange) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.put('/auth/change-password', { newPassword });
      if (res.data && res.data.token) {
        // Update the token in local storage so the requiresPasswordChange flag is cleared
        setSession(res.data.token);
        setIsOpen(false);
        // Force a hard refresh to re-evaluate auth states and fetch clean data
        window.location.reload();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.msg || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md p-8 rounded-3xl shadow-2xl border border-border">
        <h2 className="text-2xl font-bold text-foreground mb-2">Update Required</h2>
        <p className="text-muted-foreground text-sm mb-6">
          For your security, you must change your temporary password before accessing the system.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full bg-muted border border-border px-4 py-3 text-foreground focus:border-primary/40 focus:ring-1 focus:ring-ring/40 focus:outline-none transition-all rounded-xl text-sm"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full bg-muted border border-border px-4 py-3 text-foreground focus:border-primary/40 focus:ring-1 focus:ring-ring/40 focus:outline-none transition-all rounded-xl text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-destructive text-xs font-bold">{error}</p>}

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 bg-muted border border-border text-foreground hover:bg-muted/80 font-bold py-3 px-4 rounded-xl text-sm transition-all"
            >
              Sign Out
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md"
            >
              {loading ? 'Updating...' : 'Save & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
