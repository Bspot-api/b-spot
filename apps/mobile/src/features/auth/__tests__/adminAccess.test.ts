import { adminRedirectTarget, resolveAdminAccess } from '../adminAccess';

describe('resolveAdminAccess', () => {
  it('is pending while the auth state is loading', () => {
    expect(resolveAdminAccess({ isLoading: true, hasSession: false, isAdmin: false })).toBe(
      'pending'
    );
  });

  it('sends a logged-out visitor to the login screen', () => {
    expect(resolveAdminAccess({ isLoading: false, hasSession: false, isAdmin: false })).toBe(
      'login'
    );
  });

  it('sends a logged-in non-admin home', () => {
    expect(resolveAdminAccess({ isLoading: false, hasSession: true, isAdmin: false })).toBe('home');
  });

  it('grants access to a logged-in admin', () => {
    expect(resolveAdminAccess({ isLoading: false, hasSession: true, isAdmin: true })).toBe(
      'granted'
    );
  });
});

describe('adminRedirectTarget', () => {
  it('does not redirect while pending or once granted', () => {
    expect(adminRedirectTarget('pending', false)).toBeNull();
    expect(adminRedirectTarget('granted', true)).toBeNull();
  });

  it('sends a visitor who arrived logged out to the login screen', () => {
    expect(adminRedirectTarget('login', false)).toBe('/login');
  });

  it('sends an admin who just signed out home, as before', () => {
    expect(adminRedirectTarget('login', true)).toBe('/');
  });

  it('sends a non-admin home', () => {
    expect(adminRedirectTarget('home', true)).toBe('/');
  });
});
