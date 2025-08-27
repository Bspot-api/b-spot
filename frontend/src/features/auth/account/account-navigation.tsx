import { Button } from '@/components/shadcn/button';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from 'react-i18next';

export function AccountNavigation() {
  const { logout } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="absolute top-6 right-6 flex items-center gap-4">
      <Button 
        variant="ghost"
        className="text-gray-700 hover:text-gray-900"
        disabled
      >
        {t('pages.account.myAccount')}
      </Button>
      <Button 
        onClick={logout} 
        variant="secondary"
      >
        {t('pages.account.logout')}
      </Button>
    </div>
  );
} 