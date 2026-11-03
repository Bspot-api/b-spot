import { Alert, type AlertButton } from 'react-native';
import { confirmAction } from '../confirmAction';

function lastButtons(spy: jest.SpyInstance): AlertButton[] {
  const call = spy.mock.calls[spy.mock.calls.length - 1];
  return call[2] as AlertButton[];
}

describe('confirmAction (native)', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('shows a native alert with the title, the message, cancel and confirm buttons', () => {
    confirmAction({
      title: 'Supprimer',
      message: 'Supprimer définitivement ?',
      confirmLabel: 'Supprimer',
      destructive: true,
      onConfirm: jest.fn(),
    });

    expect(alertSpy).toHaveBeenCalledWith('Supprimer', 'Supprimer définitivement ?', [
      { text: 'Annuler', style: 'cancel' },
      expect.objectContaining({ text: 'Supprimer', style: 'destructive' }),
    ]);
  });

  it('runs the action when the confirm button is pressed', () => {
    const onConfirm = jest.fn();
    confirmAction({ title: 'T', message: 'M', confirmLabel: 'OK', onConfirm });

    lastButtons(alertSpy)[1].onPress?.();

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('does not run the action when cancel is pressed', () => {
    const onConfirm = jest.fn();
    confirmAction({ title: 'T', message: 'M', confirmLabel: 'OK', cancelLabel: 'Non', onConfirm });

    const [cancel, confirm] = lastButtons(alertSpy);
    cancel.onPress?.();

    expect(cancel.text).toBe('Non');
    expect(confirm.style).toBe('default');
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
