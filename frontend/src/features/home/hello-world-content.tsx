import { useCompaniesPagination } from "@/hooks/use-companies";
import { CompaniesDataTable } from "./components/companies-data-table";

export function HelloWorldContent() {
  const {
    companies,
    pagination,
    isLoading,
    error,
    page,
    limit,
    search,
    goToPage,
    updateSearch,
    updateLimit,
    isFetching,
  } = useCompaniesPagination();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Chargement des entreprises...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-red-600">
          Erreur lors du chargement des entreprises
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-10 lg:px-0">
      <h1 className="text-3xl font-bold mb-8">Liste des entreprises</h1>
      
      <div className="mb-4 text-sm text-gray-600">
        Page {page} sur {pagination?.totalPages || 1} 
        ({pagination?.total || 0} entreprises au total)
      </div>
      
      <CompaniesDataTable 
        companies={companies} 
        currentPage={page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={goToPage}
        currentSearch={search}
        onSearchChange={updateSearch}
        currentLimit={limit}
        onLimitChange={updateLimit}
        isSearching={isFetching}
      />
    </div>
  );
} 