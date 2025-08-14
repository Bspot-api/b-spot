import { Button } from '@/components/shadcn/button';
import { CompaniesDataTable } from '@/components/shadcn/companies-data-table';
import { useAuth } from '@/contexts/auth-context';
import { useCompaniesPagination } from '@/hooks/use-companies';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function DashboardContent() {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const {
    companies,
    pagination,
    isLoading,
    error,
    page,
    goToPage,
    hasNextPage,
    hasPreviousPage
  } = useCompaniesPagination();

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
      
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.dashboard.title')}</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Entreprises</h2>
          
          {isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Chargement des entreprises...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">Erreur lors du chargement des entreprises</p>
            </div>
          )}
          
          {companies && companies.length > 0 && (
            <CompaniesDataTable
              companies={companies}
              currentPage={page}
              totalPages={pagination?.totalPages || 1}
              onPageChange={goToPage}
            />
          )}
          
          {companies && companies.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucune entreprise trouvée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 