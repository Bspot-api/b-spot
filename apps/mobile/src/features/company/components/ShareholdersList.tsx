import { Text, View } from 'react-native';
import type { ShareholderDto } from '../../../api/types';

interface ShareholdersListProps {
  shareholders: ShareholderDto[];
}

export function ShareholdersList({ shareholders }: ShareholdersListProps) {
  return (
    <View className="rounded-2xl border border-zinc-200 bg-white p-4">
      <Text className="text-base font-bold text-zinc-900">Actionnaires</Text>

      {shareholders.length === 0 ? (
        <Text className="mt-3 text-sm text-zinc-500">Aucun actionnaire disponible.</Text>
      ) : (
        <View className="mt-3 gap-3">
          {shareholders.map((shareholder, index) => (
            <View
              key={`${shareholder.name}-${shareholder.type}-${index}`}
              className="rounded-xl border border-zinc-100 bg-zinc-50 p-3"
            >
              <View className="flex-row items-start justify-between gap-2">
                <Text className="flex-1 text-sm font-semibold text-zinc-900">
                  {shareholder.name}
                </Text>
                <Text className="text-sm font-bold text-zinc-900">
                  {formatPercentage(shareholder.percentage)}
                </Text>
              </View>
              <View className="mt-2 self-start rounded-full bg-blue-100 px-2 py-1">
                <Text className="text-[10px] font-bold uppercase tracking-wide text-blue-800">
                  {shareholder.type === 'corporate' ? 'Personne morale' : 'Personne physique'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function formatPercentage(value: number): string {
  return `${new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 2,
  }).format(value)} %`;
}

