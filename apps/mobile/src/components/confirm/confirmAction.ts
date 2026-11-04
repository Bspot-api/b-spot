import { Alert } from 'react-native';
import type { ConfirmRequest } from './confirmAction.types';

const DEFAULT_CANCEL_LABEL = 'Annuler';

/** Asks the user to confirm with a native alert; runs `onConfirm` on confirm. */
export function confirmAction(request: ConfirmRequest): void {
  Alert.alert(request.title, request.message, [
    { text: request.cancelLabel ?? DEFAULT_CANCEL_LABEL, style: 'cancel' },
    {
      text: request.confirmLabel,
      style: request.destructive ? 'destructive' : 'default',
      onPress: request.onConfirm,
    },
  ]);
}

export type { ConfirmRequest } from './confirmAction.types';
