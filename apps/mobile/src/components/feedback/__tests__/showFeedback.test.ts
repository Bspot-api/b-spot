import { Alert, type AlertButton } from 'react-native';
import { showFeedback } from '../showFeedback';

describe('showFeedback (native)', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('shows a native alert with the title and the message', () => {
    showFeedback({ title: 'Erreur', message: 'Impossible.', type: 'error' });

    expect(alertSpy).toHaveBeenCalledWith('Erreur', 'Impossible.', undefined);
  });

  it('runs onDismiss when the OK button is pressed, not before', () => {
    const onDismiss = jest.fn();
    showFeedback({ title: 'Merci !', message: 'Enregistré.', type: 'success', onDismiss });

    expect(onDismiss).not.toHaveBeenCalled();
    const buttons = alertSpy.mock.calls[0][2] as AlertButton[];
    expect(buttons).toHaveLength(1);
    expect(buttons[0].text).toBe('OK');
    buttons[0].onPress?.();

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
