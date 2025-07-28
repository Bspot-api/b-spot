import { Button } from '@/components/shadcn/button';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function DashboardContent() {
  const { logout } = useAuth();
  const { t } = useTranslation();
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
          {t('pages.dashboard.myAccount')}
        </Button>
        <Button 
          onClick={logout} 
          variant="secondary"
        >
          {t('pages.dashboard.logout')}
        </Button>
      </div>
      
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.dashboard.title')}</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            {t('pages.dashboard.welcomeMessage')}
          </p>
        </div>
      </div>
    </div>
  );
} 