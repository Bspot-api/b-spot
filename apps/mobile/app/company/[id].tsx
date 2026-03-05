import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';
import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Toast } from '../../src/components/reacticx/Toast';
import { CompanyHeader } from '../../src/features/company/components/CompanyHeader';
import { ExecutivesList } from '../../src/features/company/components/ExecutivesList';
import { ShareholdersList } from '../../src/features/company/components/ShareholdersList';
import { useCompanyData } from '../../src/features/company/hooks/useCompanyData';

export default function CompanyDetailScreen() {
  const { id, brandStatus, brandResolution, productSource } = useLocalSearchParams<{
    id: string;
    brandStatus?: string;
    brandResolution?: string;
    productSource?: 'OFF' | 'OBF' | 'OPEN_FOOD_FACTS' | 'OPEN_BEAUTY_FACTS';
  }>();
  const siren = Array.isArray(id) ? id[0] : id;
  const resolvedBrandStatus = Array.isArray(brandStatus) ? brandStatus[0] : brandStatus;
  const resolvedBrandResolution = Array.isArray(brandResolution)
    ? brandResolution[0]
    : brandResolution;
  const resolvedProductSource = Array.isArray(productSource)
    ? productSource[0]
    : productSource;
  const { company, executives, shareholders, isLoading, errorMessage, retry } =
    useCompanyData(siren);

  useEffect(() => {
    if (resolvedBrandResolution === 'auto_pending') {
      Toast.show("On a trouvé une correspondance probable et ajouté la marque (pending).", {
        type: 'warning',
        position: 'top',
        duration: 5200,
      });
    }
    if (resolvedBrandResolution === 'auto_active') {
      Toast.show("Tu viens d'aider l'app : on a ajouté cette marque grâce à ton scan !", {
        type: 'success',
        position: 'top',
        duration: 5200,
      });
    }
  }, [resolvedBrandResolution]);

  async function handleShare() {
    if (!company) return;
    const url = `https://b-spot.app/company/${company.siren}`;
    if (Platform.OS === 'web') {
      await navigator.clipboard.writeText(url);
      Toast.show('Lien copié dans le presse-papiers !', {
        type: 'success',
        position: 'top',
        duration: 2000,
      });
    } else {
      await Share.share({
        message: `Decouvrez ${company.legalName} sur B-Spot\n${url}`,
      });
    }
  }

  if (!siren) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50 px-6">
        <Text className="text-center text-base text-zinc-700">Identifiant entreprise manquant.</Text>
      </View>
    );
  }

  if (isLoading) {
    return <CompanyDetailSkeleton />;
  }

  if (!company) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50 px-6">
        <Text className="text-center text-lg font-semibold text-zinc-900">
          Impossible de charger cette entreprise
        </Text>
        <Text className="mt-2 text-center text-sm text-zinc-600">
          {errorMessage ?? 'Entreprise non disponible dans Pappers.'}
        </Text>
        <Pressable
          onPress={retry}
          className="mt-5 rounded-xl bg-zinc-900 px-4 py-3 active:opacity-80"
          accessibilityRole="button"
        >
          <Text className="font-semibold text-white">Reessayer</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-50">
      <ScrollView className="flex-1" contentContainerClassName="p-4 pb-8">
        {resolvedBrandStatus === 'pending' && (
          <View className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
            <Text className="text-sm font-medium text-amber-900">
              Correspondance marque en validation (pending)
            </Text>
          </View>
        )}
        <CompanyHeader
          company={company}
          onShare={handleShare}
          productSource={resolvedProductSource}
        />

        <View className="mt-4 gap-4">
          <ExecutivesList executives={executives} />
          <ShareholdersList shareholders={shareholders} />
        </View>
      </ScrollView>
    </View>
  );
}

function CompanyDetailSkeleton() {
  return (
    <ScrollView className="flex-1 bg-zinc-50" contentContainerClassName="p-4 pb-8">
      <View className="rounded-2xl border border-zinc-200 bg-white p-4">
        <View className="flex-row items-center gap-3">
          <View className="h-14 w-14 rounded-2xl bg-zinc-200" />
          <View className="flex-1 gap-2">
            <View className="h-4 w-3/4 rounded bg-zinc-200" />
            <View className="h-3 w-1/3 rounded bg-zinc-200" />
          </View>
        </View>
        <View className="mt-4 flex-row items-center justify-between">
          <View className="h-8 w-40 rounded-full bg-zinc-200" />
          <View className="h-9 w-24 rounded-xl bg-zinc-200" />
        </View>
      </View>

      <View className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
        <View className="h-4 w-24 rounded bg-zinc-200" />
        <View className="mt-4 gap-3">
          <View className="h-16 rounded-xl bg-zinc-100" />
          <View className="h-16 rounded-xl bg-zinc-100" />
        </View>
      </View>

      <View className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
        <View className="h-4 w-28 rounded bg-zinc-200" />
        <View className="mt-4 gap-3">
          <View className="h-16 rounded-xl bg-zinc-100" />
          <View className="h-16 rounded-xl bg-zinc-100" />
        </View>
      </View>

      <View className="mt-5 flex-row items-center justify-center gap-2">
        <ActivityIndicator size="small" color="#27272a" />
        <Text className="text-sm text-zinc-600">Chargement des donnees entreprise...</Text>
      </View>
    </ScrollView>
  );
}
