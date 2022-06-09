import { protocolAbsolute } from './protocol-absolute';

describe('protocolAbsolute', () => {
  test('undefined when nothing passed', () => {
    expect(protocolAbsolute('')).toBe(undefined);
  });

  test('// into https://', () => {
    expect(protocolAbsolute('//google.com')).toBe('https://google.com');
  });

  test('// anywhere but the start to have no effect', () => {
    expect(protocolAbsolute('google.//com')).toBe('google.//com');
  });
});
