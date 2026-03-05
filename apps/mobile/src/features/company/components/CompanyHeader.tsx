import { Pressable, Text, View } from 'react-native';
import type { CompanyDto } from '../../../api/types';

interface CompanyHeaderProps {
  company: CompanyDto;
  onShare: () => void;
  productSource?: 'OFF' | 'OBF' | 'OPEN_FOOD_FACTS' | 'OPEN_BEAUTY_FACTS';
}

export function CompanyHeader({ company, onShare, productSource }: CompanyHeaderProps) {
  const initials = company.legalName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <View className="rounded-2xl border border-zinc-200 bg-white p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
          <Text className="text-base font-semibold text-zinc-700">{initials || 'CO'}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-zinc-900">{company.legalName}</Text>
          <Text className="mt-1 text-sm text-zinc-500">SIREN {company.siren}</Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between gap-3">
        <View className="flex-row items-center gap-2">
          <View className="rounded-full bg-zinc-100 px-3 py-2">
            <Text className="text-xs font-medium text-zinc-700">
              Donnees au {formatDate(company.lastFetchedAt)}
            </Text>
          </View>
          {productSource && (
            <View className="rounded-full bg-emerald-100 px-3 py-2">
              <Text className="text-xs font-medium text-emerald-800">
                {isBeautySource(productSource)
                  ? 'Produit cosmetique'
                  : 'Produit alimentaire'}
              </Text>
            </View>
          )}
        </View>

        <Pressable
          onPress={onShare}
          className="rounded-xl bg-zinc-900 px-4 py-2 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Partager l'entreprise"
        >
          <Text className="text-sm font-semibold text-white">Partager</Text>
        </Pressable>
      </View>
    </View>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function isBeautySource(
  source: 'OFF' | 'OBF' | 'OPEN_FOOD_FACTS' | 'OPEN_BEAUTY_FACTS',
): boolean {
  return source === 'OBF' || source === 'OPEN_BEAUTY_FACTS';
}
