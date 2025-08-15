import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function Header() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              {t('brand.name')}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              {t('navigation.home')}
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                {t('navigation.dashboard')}
              </Link>
            )}
          </nav>

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
            
            {user ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/account" 
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  {t('navigation.account')}
                </Link>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {t('navigation.login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
