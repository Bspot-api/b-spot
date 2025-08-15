import bSpotLogo from '@/assets/b-spot-logo-removebg.png';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function Header() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center  pl-1 pr-3 py-1 rounded-md">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <img 
                src={bSpotLogo} 
                alt="B-Spot Logo" 
                className="h-12 w-12 object-contain"
              />
              {t('brand.name')}
            </Link>
          </div>

          {/* Right side - Admin link and user actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <Link 
                to="/dashboard" 
                className="text-blue-600 hover:text-blue-800 underline font-medium text-sm"
              >
                {t('pages.helloWorld.adminLink')}
              </Link>
            )}
            
            {user && (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/account" 
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  {t('navigation.account')}
                </Link>
              </div>
          )}
          </div>
        </div>
      </div>
    </header>
  );
}
