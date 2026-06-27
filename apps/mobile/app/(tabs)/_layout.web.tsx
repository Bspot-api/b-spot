import { router, Slot } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/features/auth/hooks/useAuth';

export default function WebLayout() {
  const { session, isAdmin } = useAuth();

  return (
    <View style={styles.root}>
      <View style={styles.navbar}>
        <Text style={styles.logo}>B-Spot</Text>
        <View style={styles.navRight}>
          {isAdmin && (
            <Pressable onPress={() => router.push('/admin')}>
              <Text style={styles.navLink}>Admin</Text>
            </Pressable>
          )}
          <Pressable onPress={() => router.push('/login')}>
            <Text style={styles.navLink}>
              {session ? session.user.email : 'Se connecter'}
            </Text>
          </Pressable>
        </View>
      </View>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fafafa' },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    paddingLeft: 16,
    paddingRight: 220,
    paddingVertical: 12,
  },
  logo: { fontSize: 16, fontWeight: '700', color: '#18181b' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  navLink: { fontSize: 14, color: '#71717a' },
});
