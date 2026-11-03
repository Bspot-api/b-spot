import { confirmAction } from '../confirmAction.web';

const request = {
  title: 'Rejeter',
  message: 'Rejeter la suggestion ?',
  confirmLabel: 'Rejeter',
};

describe('confirmAction (web)', () => {
  const originalConfirm = globalThis.window?.confirm;
  let confirmMock: jest.Mock<boolean, [string?]>;

  beforeEach(() => {
    confirmMock = jest.fn<boolean, [string?]>();
    globalThis.window.confirm = confirmMock;
  });

  afterEach(() => {
    globalThis.window.confirm = originalConfirm;
  });

  it('asks the browser with the message and runs the action when accepted', () => {
    confirmMock.mockReturnValue(true);
    const onConfirm = jest.fn();

    confirmAction({ ...request, onConfirm });

    expect(confirmMock).toHaveBeenCalledWith('Rejeter la suggestion ?');
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('does not run the action when the browser dialog is dismissed', () => {
    confirmMock.mockReturnValue(false);
    const onConfirm = jest.fn();

    confirmAction({ ...request, onConfirm });

    expect(onConfirm).not.toHaveBeenCalled();
  });
});
