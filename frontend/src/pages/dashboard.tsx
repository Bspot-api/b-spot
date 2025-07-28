import { Button } from '@/components/shadcn/button';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-svh bg-gray-50 p-6 relative">
      {/* Navigation buttons - absolute top right */}
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <Button 
          variant="ghost"
          className="text-gray-700 hover:text-gray-900"
          onClick={() => navigate('/account')}
        >
          Mon compte
        </Button>
        <Button 
          onClick={logout} 
          variant="secondary"
        >
          Se déconnecter
        </Button>
      </div>
      
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Bienvenue sur votre tableau de bord. Cette page n'est accessible qu'aux utilisateurs connectés.
          </p>
        </div>
      </div>
    </div>
  );
} 