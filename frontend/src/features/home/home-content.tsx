import { useCompaniesPagination } from "@/hooks/use-companies";
import { useTranslation } from "react-i18next";
import { CompaniesDataTable } from "./components/companies-data-table";

export function HomeContent() {
  const {
    companies,
    pagination,
    isLoading,
    error,
    page,
    limit,
    search,
    sectorIds,
    fundIds,
    personalityIds,
    goToPage,
    updateSearch,
    updateLimit,
    updateSectorIds,
    updateFundIds,
    updatePersonalityIds,
    isFetching,
  } = useCompaniesPagination();

  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">{t('companies.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-red-600">
          {t('companies.error')}
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-10 lg:px-0">
      <h1 className="text-3xl font-bold mb-8">{t('companies.title')}</h1>
      
      <CompaniesDataTable 
        companies={companies} 
        currentPage={page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={goToPage}
        currentSearch={search}
        onSearchChange={updateSearch}
        currentLimit={limit}
        onLimitChange={updateLimit}
        currentSectorIds={sectorIds}
        onSectorIdsChange={updateSectorIds}
        currentFundIds={fundIds}
        onFundIdsChange={updateFundIds}
        currentPersonalityIds={personalityIds}
        onPersonalityIdsChange={updatePersonalityIds}
        isSearching={isFetching}
      />
    </div>
  );
} 