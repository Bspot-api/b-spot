import { CompaniesDataTable } from "@/components/shadcn/companies-data-table";
import { useCompanies } from "@/hooks/use-companies";
import { useState } from "react";

export function HelloWorldContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 30;
  
  const { data, isLoading, error } = useCompanies(currentPage, pageSize);

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

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Aucune entreprise trouvée</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Liste des entreprises</h1>
      
      <div className="mb-4 text-sm text-gray-600">
        Page {currentPage} sur {data.pagination?.totalPages || 1} 
        ({data.pagination?.total || 0} entreprises au total)
      </div>
      
      <CompaniesDataTable 
        companies={data.data} 
        currentPage={currentPage}
        totalPages={data.pagination?.totalPages || 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
} 