import { useQueryClient, useQuery } from '@tanstack/react-query';
import { getSession, getAdminMe, signOut as apiSignOut } from '../../../api/client';
import { ApiError } from '../../../api/client';
import type { Session, AdminProfile } from '../types';
import { clearSessionCookie } from '../sessionStore';

const STALE_TIME = 5 * 60 * 1000;

async function fetchAdminProfile() {
  try {
    return await getAdminMe();
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 403) return null;
    throw err;
  }
}

export function useAuth() {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: getSession,
    staleTime: STALE_TIME,
  });

  const sessionData = sessionQuery.data ?? null;
  const session: Session | null = sessionData ? { user: sessionData.user } : null;

  const adminQuery = useQuery({
    queryKey: ['auth', 'admin'],
    queryFn: fetchAdminProfile,
    enabled: session !== null,
    staleTime: STALE_TIME,
  });

  // The cached profile outlives an ended session; without a session there is no admin.
  const adminProfileData = session ? (adminQuery.data ?? null) : null;
  const adminProfile: AdminProfile | null = adminProfileData
    ? {
        adminId: adminProfileData.adminId,
        userId: adminProfileData.userId,
        email: adminProfileData.email,
        name: adminProfileData.name,
        promotedAt: adminProfileData.promotedAt,
      }
    : null;

  /** Ends the session on the API; the local session ends even if that call fails. */
  async function signOut() {
    try {
      await apiSignOut();
    } catch (error) {
      console.warn('[auth] sign-out request failed; clearing the local session anyway', error);
    }
    await clearSessionCookie();
    await queryClient.invalidateQueries({ queryKey: ['auth'] });
  }

  return {
    session,
    isAdmin: adminProfile !== null,
    adminProfile,
    isLoading: sessionQuery.isPending || (session !== null && adminQuery.isPending),
    signOut,
  };
}
