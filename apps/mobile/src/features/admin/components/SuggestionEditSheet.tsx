import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';
import { BottomSheet } from '../../../components/BottomSheet';
import type { SuggestionDraft } from '../suggestion-draft';

interface SuggestionEditSheetProps {
  isPresented: boolean;
  draft: SuggestionDraft;
  isSaving: boolean;
  onChangeDraft: (field: keyof SuggestionDraft, value: string) => void;
  onDismiss: () => void;
  onSave: () => void;
}

export function SuggestionEditSheet({
  isPresented,
  draft,
  isSaving,
  onChangeDraft,
  onDismiss,
  onSave,
}: SuggestionEditSheetProps) {
  return (
    <BottomSheet isPresented={isPresented} onDismiss={onDismiss} testID="suggestion-edit-sheet">
      <View style={{ padding: 20, gap: 16 }}>
        <Text style={{ fontSize: 17, fontWeight: '600', color: '#18181b' }}>
          Modifier la suggestion
        </Text>

        <DraftField
          label="Marque *"
          value={draft.brandName}
          onChangeText={(value) => onChangeDraft('brandName', value)}
          placeholder="Nom de la marque"
          testID="suggestion-edit-brand-input"
        />
        <DraftField
          label="Produit"
          value={draft.productName}
          onChangeText={(value) => onChangeDraft('productName', value)}
          placeholder="Nom du produit"
        />
        <DraftField
          label="Code-barre"
          value={draft.barcode}
          onChangeText={(value) => onChangeDraft('barcode', value)}
          placeholder="EAN"
          keyboardType="numeric"
        />
        <DraftField
          label="Notes"
          value={draft.notes}
          onChangeText={(value) => onChangeDraft('notes', value)}
          placeholder="Notes internes"
          multiline
        />

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
          <Pressable
            onPress={onDismiss}
            style={({ pressed }) => [CANCEL_BUTTON_STYLE, pressed && { opacity: 0.7 }]}
          >
            <Text style={{ color: '#71717a', fontWeight: '500', fontSize: 15 }}>Annuler</Text>
          </Pressable>
          <Pressable
            onPress={onSave}
            testID="suggestion-edit-save"
            disabled={isSaving}
            style={({ pressed }) => [SAVE_BUTTON_STYLE, pressed && { opacity: 0.7 }]}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Enregistrer</Text>
            )}
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}

interface DraftFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  testID?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
}

function DraftField({ label, multiline, ...inputProps }: DraftFieldProps) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ fontSize: 12, color: '#71717a', fontWeight: '500' }}>{label}</Text>
      <TextInput
        {...inputProps}
        style={multiline ? [INPUT_STYLE, { minHeight: 72, textAlignVertical: 'top' }] : INPUT_STYLE}
        placeholderTextColor="#a1a1aa"
        multiline={multiline}
      />
    </View>
  );
}

const INPUT_STYLE = {
  borderWidth: 1,
  borderColor: '#e4e4e7',
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontSize: 15,
  color: '#18181b',
  backgroundColor: '#fafafa',
};

const CANCEL_BUTTON_STYLE = {
  flex: 1,
  borderWidth: 1,
  borderColor: '#e4e4e7',
  borderRadius: 12,
  paddingVertical: 13,
  alignItems: 'center' as const,
};

const SAVE_BUTTON_STYLE = {
  flex: 1,
  backgroundColor: '#18181b',
  borderRadius: 12,
  paddingVertical: 13,
  alignItems: 'center' as const,
};
