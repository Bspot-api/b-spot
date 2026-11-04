export type FeedbackType = 'success' | 'error' | 'warning';

export interface FeedbackRequest {
  /** Native alert title; not shown on web. */
  title: string;
  /** The message, shown on every platform. */
  message: string;
  /** Web toast colour; not used on native. */
  type: FeedbackType;
  /** Runs once the user is done with the message: on OK on native, at once on web. */
  onDismiss?: () => void;
}
