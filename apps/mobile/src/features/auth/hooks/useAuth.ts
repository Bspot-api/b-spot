import { useQueryClient, useQuery } from '@tanstack/react-query';
import { getSession, getAdminMe, signOut as apiSignOut } from '../../../api/client';
import { ApiError } from '../../../api/client';
import type { Session, AdminProfile } from '../types';

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

  const adminProfileData = adminQuery.data ?? null;
  const adminProfile: AdminProfile | null = adminProfileData
    ? {
        adminId: adminProfileData.adminId,
        userId: adminProfileData.userId,
        email: adminProfileData.email,
        name: adminProfileData.name,
        promotedAt: adminProfileData.promotedAt,
      }
    : null;

  async function signOut() {
    await apiSignOut();
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
