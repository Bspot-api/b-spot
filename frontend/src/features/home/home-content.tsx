import { useInfiniteCompaniesPagination } from "@/hooks/use-infinite-companies";
import { useTranslation } from "react-i18next";
import { CompaniesGrid } from "./components/companies-grid";

export function HomeContent() {
  const {
    companies,
    isLoading,
    error,
    search,
    sectorIds,
    fundIds,
    personalityIds,
    updateSearch,
    updateSectorIds,
    updateFundIds,
    updatePersonalityIds,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteCompaniesPagination();

  const { t } = useTranslation();

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
      
      <CompaniesGrid 
        companies={companies} 
        currentSearch={search}
        onSearchChange={updateSearch}
        currentSectorIds={sectorIds}
        onSectorIdsChange={updateSectorIds}
        currentFundIds={fundIds}
        onFundIdsChange={updateFundIds}
        currentPersonalityIds={personalityIds}
        onPersonalityIdsChange={updatePersonalityIds}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
} 
