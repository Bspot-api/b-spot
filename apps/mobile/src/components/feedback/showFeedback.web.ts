import { Toast } from '../reacticx/Toast';
import type { FeedbackRequest } from './showFeedback.types';

/** Shows a message that needs no decision, as a toast (`Alert.alert` does nothing on web). */
export function showFeedback(request: FeedbackRequest): void {
  Toast.show(request.message, { type: request.type });
  request.onDismiss?.();
}

export type { FeedbackRequest, FeedbackType } from './showFeedback.types';
