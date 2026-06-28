import { Text, View } from 'react-native';
import type { ExecutiveDto } from '../../../api/types';

interface ExecutivesListProps {
  executives: ExecutiveDto[];
}

export function ExecutivesList({ executives }: ExecutivesListProps) {
  return (
    <View className="rounded-2xl border border-zinc-200 bg-white p-4">
      <Text className="text-base font-bold text-zinc-900">Dirigeants</Text>

      {executives.length === 0 ? (
        <Text className="mt-3 text-sm text-zinc-500">Aucun dirigeant disponible.</Text>
      ) : (
        <View className="mt-3 gap-3">
          {executives.map((executive, index) => {
            const isCeo = isExecutiveLead(executive.role);

            return (
              <View
                key={`${executive.name}-${executive.role}-${index}`}
                className="rounded-xl border border-zinc-100 bg-zinc-50 p-3"
              >
                <View className="flex-row items-start justify-between gap-2">
                  <Text className="flex-1 text-sm font-semibold text-zinc-900">
                    {executive.name}
                  </Text>
                  {isCeo ? (
                    <View className="rounded-full bg-emerald-100 px-2 py-1">
                      <Text className="text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                        Directeur General
                      </Text>
                    </View>
                  ) : null}
                </View>

                <Text className="mt-1 text-sm text-zinc-600">{executive.role}</Text>
                {executive.startDate ? (
                  <Text className="mt-1 text-xs text-zinc-500">
                    Depuis {formatShortDate(executive.startDate)}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

function isExecutiveLead(role: string): boolean {
  const normalized = role.toLowerCase();
  return (
    normalized.includes('directeur général') ||
    normalized.includes('directrice générale') ||
    normalized.includes('ceo') ||
    normalized.includes('président-directeur général') ||
    normalized.includes('president-directeur general')
  );
}

function formatShortDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('fr-FR', {
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}
