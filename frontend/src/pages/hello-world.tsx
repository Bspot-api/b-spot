import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function HelloWorldPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-svh relative">
      {/* Admin link - only visible when connected */}
      {user && (
        <div className="absolute top-4 right-4">
          <Link 
            to="/dashboard" 
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            {t('pages.helloWorld.adminLink')}
          </Link>
        </div>
      )}
      
      {/* Main content - centered */}
      <div className="flex min-h-svh items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-900">{t('pages.helloWorld.title')}</h1>
      </div>
    </div>
  );
} 