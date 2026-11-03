import type { ConfirmRequest } from './confirmAction.types';

/** Asks the user to confirm with the browser dialog; runs `onConfirm` on confirm. */
export function confirmAction(request: ConfirmRequest): void {
  if (window.confirm(request.message)) request.onConfirm();
}

export type { ConfirmRequest } from './confirmAction.types';
