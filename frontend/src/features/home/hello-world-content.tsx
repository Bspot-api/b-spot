import { CompaniesDataTable } from '@/components/shadcn/companies-data-table';
import { useAuth } from '@/contexts/auth-context';
import { useCompanies } from '@/hooks/use-companies';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function HelloWorldContent() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: companies, isLoading, error } = useCompanies();

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
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('pages.helloWorld.title')}
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez toutes les entreprises de notre base de données
          </p>
        </div>

        {/* Companies Data Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Chargement des entreprises...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="text-red-600">
                  Erreur lors du chargement des entreprises. Veuillez réessayer.
                </div>
              </div>
            </div>
          )}

          {companies && companies.length > 0 && (
            <CompaniesDataTable companies={companies} />
          )}

          {companies && companies.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              Aucune entreprise trouvée dans la base de données.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 