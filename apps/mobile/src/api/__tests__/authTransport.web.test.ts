import { getAuthRequestInit, getMagicLinkCallbackURL } from '../authTransport.web';

const WEB_ORIGIN = 'https://b-spot.org';

describe('authTransport (web)', () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    globalThis.window = { location: { origin: WEB_ORIGIN } } as Window & typeof globalThis;
  });

  afterEach(() => {
    globalThis.window = originalWindow;
  });

  it('calls the magic link back to the web app origin', () => {
    // Arrange
    const expectedURL = `${WEB_ORIGIN}/`;

    // Act
    const actualURL = getMagicLinkCallbackURL();

    // Assert
    expect(actualURL).toBe(expectedURL);
  });

  it('authenticates with the browser cookie jar and no extra header', async () => {
    // Act
    const actualInit = await getAuthRequestInit();

    // Assert
    expect(actualInit).toEqual({ credentials: 'include', headers: {} });
  });
});
