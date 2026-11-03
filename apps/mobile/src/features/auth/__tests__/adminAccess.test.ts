import { resolveAdminAccess, resolveAdminRedirect } from '../adminAccess';

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

describe('resolveAdminRedirect', () => {
  it('does not redirect while pending or once granted', () => {
    expect(resolveAdminRedirect({ access: 'pending', hadSession: false })).toBeNull();
    expect(resolveAdminRedirect({ access: 'granted', hadSession: true })).toBeNull();
  });

  it('sends a visitor who arrived logged out to the login screen', () => {
    expect(resolveAdminRedirect({ access: 'login', hadSession: false })).toBe('/login');
  });

  it('sends an admin who just signed out home, as before', () => {
    expect(resolveAdminRedirect({ access: 'login', hadSession: true })).toBe('/');
  });

  it('sends a non-admin home', () => {
    expect(resolveAdminRedirect({ access: 'home', hadSession: true })).toBe('/');
  });
});
