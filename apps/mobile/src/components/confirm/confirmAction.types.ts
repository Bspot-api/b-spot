export interface ConfirmRequest {
  /** Native alert title; not shown on web. */
  title: string;
  /** The question, shown on every platform. */
  message: string;
  /** Native confirm button label; not shown on web. */
  confirmLabel: string;
  /** Native cancel button label. */
  cancelLabel?: string;
  /** Native confirm button style. */
  destructive?: boolean;
  onConfirm: () => void;
}
