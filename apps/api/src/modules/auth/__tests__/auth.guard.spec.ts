jest.mock('../auth.service');

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';

describe('AuthGuard', () => {
  const mockGetSession = jest.fn();
  const authService = {
    api: { getSession: mockGetSession },
  } as unknown as import('../auth.service').AuthService;

  const guard = new AuthGuard(authService);

  const createContext = (headers: Record<string, string> = {}) => {
    const request: { headers: Record<string, string>; session?: unknown } = { headers };
    return {
      switchToHttp: () => ({ getRequest: () => request }),
      request,
    };
  };

  afterEach(() => jest.clearAllMocks());

  it('throws UnauthorizedException when no session exists', async () => {
    mockGetSession.mockResolvedValue(null);
    const { switchToHttp } = createContext();

    await expect(
      guard.canActivate({ switchToHttp } as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('sets session on request when session is valid', async () => {
    const session = { user: { id: 'user-1', email: 'admin@test.com' } };
    mockGetSession.mockResolvedValue(session);
    const { switchToHttp, request } = createContext({ cookie: 'session_token=abc' });

    await expect(
      guard.canActivate({ switchToHttp } as ExecutionContext),
    ).resolves.toBe(true);
    expect(request.session).toEqual(session);
  });
});
