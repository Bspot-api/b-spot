import { Toast } from '../../reacticx/Toast';
import { showFeedback } from '../showFeedback.web';

jest.mock('../../reacticx/Toast', () => ({ Toast: { show: jest.fn() } }));

const showMock = Toast.show as jest.Mock;

describe('showFeedback (web)', () => {
  beforeEach(() => {
    showMock.mockClear();
  });

  it('shows the message as a toast of the matching type', () => {
    showFeedback({ title: 'Marque manquante', message: 'Renseigne la marque.', type: 'warning' });

    expect(showMock).toHaveBeenCalledWith('Renseigne la marque.', { type: 'warning' });
  });

  it('runs onDismiss right away, since a toast needs no answer', () => {
    const onDismiss = jest.fn();

    showFeedback({ title: 'Merci !', message: 'Enregistré.', type: 'success', onDismiss });

    expect(showMock).toHaveBeenCalledWith('Enregistré.', { type: 'success' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
