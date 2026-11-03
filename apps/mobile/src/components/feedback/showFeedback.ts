import { Alert } from 'react-native';
import type { FeedbackRequest } from './showFeedback.types';

const OK_LABEL = 'OK';

/** Shows a message that needs no decision, as a native alert. */
export function showFeedback(request: FeedbackRequest): void {
  const buttons = request.onDismiss ? [{ text: OK_LABEL, onPress: request.onDismiss }] : undefined;
  Alert.alert(request.title, request.message, buttons);
}

export type { FeedbackRequest, FeedbackType } from './showFeedback.types';
