import { useTranslation } from 'react-i18next';
import { AccountInfo } from './account/account-info';
import { AccountNavigation } from './account/account-navigation';
import { ChangePasswordForm } from './account/change-password-form';

export function AccountContent() {
  const { t } = useTranslation();

  return (
    <div className="min-h-svh bg-gray-50 p-6 relative">
      <AccountNavigation />
      
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.account.title')}</h1>
        
        <div className="space-y-6">
          <AccountInfo />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
} 