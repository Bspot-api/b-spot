import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { OrbitDotLoader } from '../src/components/reacticx/OrbitingDots';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signInMagicLink } from '../src/api/client';
import { useAuth } from '../src/features/auth/hooks/useAuth';

const POLL_INTERVAL = 3000;

export default function LoginScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (session) router.replace('/');
  }, [session, router]);

  useEffect(() => {
    if (!sent) return;
    const interval = setInterval(() => {
      void queryClient.refetchQueries({ queryKey: ['auth', 'session'] });
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [sent, queryClient]);

  const sendLink = useMutation({
    mutationFn: (addr: string) => signInMagicLink(addr),
    onSuccess: () => setSent(true),
  });

  function handleSubmit() {
    const trimmed = email.trim();
    if (trimmed) sendLink.mutate(trimmed);
  }

  if (sent) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50 px-6">
        <OrbitDotLoader size={64} duration={1000} numDots={6} dotColor="#18181b" />
        <Text className="mt-8 text-2xl font-bold text-zinc-900">Vérifiez votre boîte mail</Text>
        <Text className="mt-3 text-center text-zinc-500">
          Un lien de connexion a été envoyé à {email.trim()}. Cliquez dessus pour vous connecter.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-50 px-6 pt-12">
      <Text className="text-2xl font-bold text-zinc-900">Connexion</Text>
      <Text className="mt-2 text-zinc-500">
        Entrez votre email pour recevoir un lien de connexion.
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="votre@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        className="mt-6 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900"
      />

      <Pressable
        onPress={handleSubmit}
        disabled={sendLink.isPending || !email.trim()}
        className="mt-4 flex-row items-center justify-center rounded-xl bg-zinc-900 px-4 py-4 active:opacity-85"
        accessibilityRole="button"
      >
        {sendLink.isPending ? (
          <>
            <ActivityIndicator size="small" color="#fff" />
            <Text className="ml-2 font-semibold text-white">Envoi...</Text>
          </>
        ) : (
          <Text className="font-semibold text-white">Recevoir un lien de connexion</Text>
        )}
      </Pressable>

      {sendLink.isError && (
        <Text className="mt-3 text-center text-red-500">
          Impossible d'envoyer le lien. Vérifiez votre email et réessayez.
        </Text>
      )}
    </View>
  );
}
