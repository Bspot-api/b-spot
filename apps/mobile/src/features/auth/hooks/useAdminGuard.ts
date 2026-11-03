import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { adminRedirectTarget, resolveAdminAccess, type AdminAccess } from '../adminAccess';
import { useAuth } from './useAuth';

/**
 * Guards an admin-only screen: redirects a logged-out visitor to the login
 * screen and a non-admin home. Admin data must be fetched only when
 * `access === 'granted'`.
 */
export function useAdminGuard(): ReturnType<typeof useAuth> & { access: AdminAccess } {
  const router = useRouter();
  const auth = useAuth();
  const hadSession = useRef(false);
  if (auth.session !== null) hadSession.current = true;

  const access = resolveAdminAccess({
    isLoading: auth.isLoading,
    hasSession: auth.session !== null,
    isAdmin: auth.isAdmin,
  });

  useEffect(() => {
    const target = adminRedirectTarget(access, hadSession.current);
    if (target) router.replace(target);
  }, [access, router]);

  return { ...auth, access };
}
