import { absoluteUrl } from './absolute-url';

describe('absoluteUrl', () => {
  test('undefined when nothing passed', () => {
    expect(absoluteUrl('')).toBe(undefined);
  });

  test('// into https://', () => {
    expect(absoluteUrl('//google.com')).toBe('https://google.com');
  });

  test('// anywhere but the start to have no effect', () => {
    expect(absoluteUrl('google.//com')).toBe('google.//com');
  });
});
