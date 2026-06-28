import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';
import { useAuth } from '../../src/features/auth/hooks/useAuth';

export default function TabLayout() {
  const { isAdmin, session } = useAuth();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#18181b',
        tabBarInactiveTintColor: '#71717a',
        headerShown: true,
        headerStyle: { backgroundColor: '#f4f4f5' },
        headerTintColor: '#18181b',
        headerTitleStyle: { fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e4e4e7',
        },
        headerRight: () => (
          <Pressable
            onPress={() => router.push('/login')}
            className="mr-4"
            accessibilityRole="button"
          >
            <Text className="text-sm text-zinc-500">
              {session ? session.user.email : 'Se connecter'}
            </Text>
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color, size }) => <Ionicons name="camera" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historique',
          tabBarIcon: ({ color, size }) => <Ionicons name="time" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-checkmark" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
