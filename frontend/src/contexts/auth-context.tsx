import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { signIn, signOut, useSession } from '@/lib/auth-client';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, isPending } = useSession();

  const login = async (email: string, password: string) => {
    const result = await signIn.email({
      email,
      password,
    });

    if (result.error) {
      throw new Error(result.error.message || 'Login failed');
    }
  };

  const logout = async () => {
    await signOut();
  };

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isPending,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 