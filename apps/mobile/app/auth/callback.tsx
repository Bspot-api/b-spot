import { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { showFeedback } from '../../src/components/feedback/showFeedback';
import { readAuthCallback, type AuthCallback } from '../../src/features/auth/sessionCookie';
import { saveSessionCookie } from '../../src/features/auth/sessionStore';

const INVALID_LINK_TITLE = 'Connexion';
const SPINNER_COLOR = '#27272a';
const INVALID_LINK_MESSAGE = "Ce lien de connexion n'est plus valide. Demandez-en un nouveau.";

/** Back to the screen under the login modal (the Scanner tab), or to it on a cold start. */
function leaveForHome(): void {
  if (router.canDismiss()) router.dismissAll();
  else router.replace('/');
}

async function completeCallback(callback: AuthCallback, queryClient: QueryClient): Promise<void> {
  if (callback.kind === 'session') {
    await saveSessionCookie(callback.cookie);
    await queryClient.invalidateQueries({ queryKey: ['auth'] });
    leaveForHome();
    return;
  }
  if (callback.kind === 'error') {
    // A native alert, not a toast: the toast would sit under the login modal.
    leaveForHome();
    showFeedback({
      title: INVALID_LINK_TITLE,
      message: INVALID_LINK_MESSAGE,
      type: 'error',
      onDismiss: () => router.push('/login'),
    });
    return;
  }
  leaveForHome();
}

/**
 * Native only: `<scheme>://auth/callback`, where the magic link lands once
 * the browser has verified it. The API's `expo()` plugin puts the session
 * cookie in `?cookie=`, or Better-Auth puts `?error=` for a used or expired link.
 */
export default function AuthCallbackScreen() {
  const params = useLocalSearchParams<{ cookie?: string; error?: string }>();
  const queryClient = useQueryClient();
  const isHandled = useRef(false);

  useEffect(() => {
    if (isHandled.current) return;
    isHandled.current = true;
    void completeCallback(readAuthCallback(params), queryClient);
  }, [params, queryClient]);

  return (
    <View className="flex-1 items-center justify-center bg-zinc-50" testID="auth-callback">
      <ActivityIndicator size="small" color={SPINNER_COLOR} />
    </View>
  );
}
