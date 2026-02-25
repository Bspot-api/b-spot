import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProviderWithViewport } from '../src/components/reacticx/Toast';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProviderWithViewport>
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
