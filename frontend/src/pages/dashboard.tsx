import { Button } from '@/components/shadcn/button';
import { useAuth } from '@/contexts/auth-context';

export function Dashboard() {
  const { logout } = useAuth();

  return (
    <div className="min-h-svh bg-gray-50 p-6 flex flex-col">
      <div className="mx-auto max-w-4xl flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Bienvenue sur votre tableau de bord. Cette page n'est accessible qu'aux utilisateurs connectés.
          </p>
        </div>
      </div>
      
      {/* Logout button - bottom center */}
      <div className="flex justify-center mt-8">
        <Button 
          onClick={logout} 
          variant="secondary"
          className="px-8"
        >
          Se déconnecter
        </Button>
      </div>
    </div>
  );
} 