import { LoginForm } from '@/components/auth/login-form';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render login form if already logged in
  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
} 