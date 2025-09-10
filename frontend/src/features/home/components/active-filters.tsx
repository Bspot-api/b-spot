import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/shadcn/button';
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/use-api-client';

interface ActiveFiltersProps {
  currentSearch: string;
  currentSectorIds: string[];
  currentFundIds: string[];
  currentPersonalityIds: string[];
  onSearchChange: (search: string) => void;
  onSectorIdsChange: (sectorIds: string[]) => void;
  onFundIdsChange: (fundIds: string[]) => void;
  onPersonalityIdsChange: (personalityIds: string[]) => void;
}

export function ActiveFilters({
  currentSearch,
  currentSectorIds,
  currentFundIds,
  currentPersonalityIds,
  onSearchChange,
  onSectorIdsChange,
  onFundIdsChange,
  onPersonalityIdsChange,
}: ActiveFiltersProps) {
  const { t } = useTranslation();
  const client = useApiClient();

  // Fetch entities to get their names
  const { data: sectors } = useQuery({
    queryKey: ['sectors'],
    queryFn: () => client.GET('/sectors'),
  });

  const { data: funds } = useQuery({
    queryKey: ['funds'],
    queryFn: () => client.GET('/funds'),
  });

  const { data: personalities } = useQuery({
    queryKey: ['personalities'],
    queryFn: () => client.GET('/personalities'),
  });

  const hasActiveFilters = currentSearch || 
                          currentSectorIds.length > 0 || 
                          currentFundIds.length > 0 || 
                          currentPersonalityIds.length > 0;

  if (!hasActiveFilters) {
    return null;
  }

  const clearAllFilters = () => {
    onSearchChange('');
    onSectorIdsChange([]);
    onFundIdsChange([]);
    onPersonalityIdsChange([]);
  };

  const removeSector = (sectorId: string) => {
    onSectorIdsChange(currentSectorIds.filter(id => id !== sectorId));
  };

  const removeFund = (fundId: string) => {
    onFundIdsChange(currentFundIds.filter(id => id !== fundId));
  };

  const removePersonality = (personalityId: string) => {
    onPersonalityIdsChange(currentPersonalityIds.filter(id => id !== personalityId));
  };

  const getSectorName = (id: string) => {
    return sectors?.find(s => s.id === id)?.name || id;
  };

  const getFundName = (id: string) => {
    return funds?.find(f => f.id === id)?.name || id;
  };

  const getPersonalityName = (id: string) => {
    return personalities?.find(p => p.id === id)?.name || id;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-700">
        Filtres actifs:
      </span>

      {/* Search filter */}
      {currentSearch && (
        <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
          <span>"{currentSearch}"</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-blue-200"
            onClick={() => onSearchChange('')}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Sector filters */}
      {currentSectorIds.map((sectorId) => (
        <div
          key={sectorId}
          className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
        >
          <span>{getSectorName(sectorId)}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-green-200"
            onClick={() => removeSector(sectorId)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}

      {/* Fund filters */}
      {currentFundIds.map((fundId) => (
        <div
          key={fundId}
          className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm"
        >
          <span>{getFundName(fundId)}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-purple-200"
            onClick={() => removeFund(fundId)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}

      {/* Personality filters */}
      {currentPersonalityIds.map((personalityId) => (
        <div
          key={personalityId}
          className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm"
        >
          <span>{getPersonalityName(personalityId)}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-orange-200"
            onClick={() => removePersonality(personalityId)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}

      {/* Clear all button */}
      <Button
        variant="outline"
        size="sm"
        onClick={clearAllFilters}
        className="ml-2"
      >
        Tout effacer
      </Button>
    </div>
  );
}