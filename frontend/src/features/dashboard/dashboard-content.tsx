import { useAuth } from '@/contexts/auth-context';

export function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-svh bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900">
          Connecté en tant que {user?.email}
        </h1>
      </div>
    </div>
  );
} 