import { router, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiError } from '../src/api/client';
import { Toast, ToastProviderWithViewport } from '../src/components/reacticx/Toast';
import '../global.css';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiError && error.statusCode === 401) {
        setTimeout(() => {
          Toast.show('Votre session a expirée. Reconnectez-vous.');
          void queryClient.invalidateQueries({ queryKey: ['auth'] });
          router.replace('/login');
        }, 0);
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function StagingBadge() {
  // if (!isStaging || Platform.OS !== 'web') return null;
  return (
    <View style={styles.stagingBadge}>
      <Text style={styles.stagingText}>En cours de développement</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stagingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 9999,
  },
  stagingText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProviderWithViewport>
        <StagingBadge />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4f4f5',
            },
            headerTintColor: '#18181b',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="company/[id]"
            options={{
              title: 'Company Details',
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="brand-suggestion/new"
            options={{
              title: 'Ajouter une marque',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              title: 'Connexion',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="admin/suggestions"
            options={{
              title: 'Suggestions de marques',
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="privacy"
            options={{
              title: 'Politique de confidentialité',
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="+not-found"
            options={{
              title: 'Not Found',
            }}
          />
        </Stack>
      </ToastProviderWithViewport>
    </QueryClientProvider>
  );
}
