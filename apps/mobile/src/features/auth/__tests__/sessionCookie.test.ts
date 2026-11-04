import { extractSessionCookie, readAuthCallback } from '../sessionCookie';

const TOKEN = 'HHQegX1pVU51PvO11Ui7jYFYhlnbdC50.gWTggHKjQdG0iAVb99gCgTRGlx%3D';

describe('extractSessionCookie', () => {
  it('keeps name=value of the Better-Auth session cookie', () => {
    const header = `better-auth.session_token=${TOKEN}; Max-Age=604800; Path=/; HttpOnly; SameSite=Lax`;
    expect(extractSessionCookie(header)).toBe(`better-auth.session_token=${TOKEN}`);
  });

  it('keeps the __Secure- name production uses over https', () => {
    const header = `__Secure-better-auth.session_token=${TOKEN}; Max-Age=604800; Path=/; Secure`;
    expect(extractSessionCookie(header)).toBe(`__Secure-better-auth.session_token=${TOKEN}`);
  });

  it('finds the session cookie among several, Expires dates included', () => {
    const header = [
      'better-auth.dont_remember=x; Expires=Wed, 11 Nov 2026 15:41:38 GMT; Path=/',
      `better-auth.session_token=${TOKEN}; Expires=Wed, 11 Nov 2026 15:41:38 GMT; Path=/`,
    ].join(', ');
    expect(extractSessionCookie(header)).toBe(`better-auth.session_token=${TOKEN}`);
  });

  it('restores the encoding of a signature the deep link decoded (+ / = or a space for +)', () => {
    const encoded = 'tok.yhSbqeu60%2BQlfo%2FM%3D';
    expect(extractSessionCookie('better-auth.session_token=tok.yhSbqeu60+Qlfo/M=')).toBe(
      `better-auth.session_token=${encoded}`
    );
    expect(extractSessionCookie('better-auth.session_token=tok.yhSbqeu60 Qlfo/M=')).toBe(
      `better-auth.session_token=${encoded}`
    );
    expect(extractSessionCookie(`better-auth.session_token=${encoded}`)).toBe(
      `better-auth.session_token=${encoded}`
    );
  });

  it('returns null for a cookie being deleted', () => {
    expect(extractSessionCookie('better-auth.session_token=; Max-Age=0; Path=/')).toBeNull();
  });

  it('returns null when there is no session cookie', () => {
    expect(extractSessionCookie('other=1; Path=/')).toBeNull();
    expect(extractSessionCookie('')).toBeNull();
  });
});

describe('readAuthCallback', () => {
  it('reads a session from the cookie param', () => {
    expect(readAuthCallback({ cookie: `better-auth.session_token=${TOKEN}; Path=/` })).toEqual({
      kind: 'session',
      cookie: `better-auth.session_token=${TOKEN}`,
    });
  });

  it('reads the error Better-Auth appends to an invalid or used link', () => {
    expect(readAuthCallback({ error: 'INVALID_TOKEN' })).toEqual({
      kind: 'error',
      code: 'INVALID_TOKEN',
    });
  });

  it('is invalid with neither param, or a cookie without a session', () => {
    expect(readAuthCallback({})).toEqual({ kind: 'invalid' });
    expect(readAuthCallback({ cookie: 'other=1' })).toEqual({ kind: 'invalid' });
  });

  it('takes the first value when a param is repeated', () => {
    expect(readAuthCallback({ error: ['INVALID_TOKEN', 'x'] })).toEqual({
      kind: 'error',
      code: 'INVALID_TOKEN',
    });
  });
});
