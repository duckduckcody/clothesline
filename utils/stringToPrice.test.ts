import { stringToPrice } from './stringToPrice';

describe('stringToPrice', () => {
  test('parses simple price to number', () => {
    expect(stringToPrice('$55')).toBe(55);
  });

  test('parses simple price to float', () => {
    expect(stringToPrice('$55.55')).toBe(55.55);
  });

  test('removes extra content', () => {
    expect(stringToPrice('   \n    \n    $55.55        \n ')).toBe(55.55);
  });

  test('returns undefined on no price', () => {
    expect(stringToPrice('   \n    \n    abc        \n ')).toBe(undefined);
  });
});
