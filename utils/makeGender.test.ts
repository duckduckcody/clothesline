import { logBadProduct } from './logging';
import { makeGender } from './makeGender';

jest.mock('./logging', () => {
  return {
    logBadProduct: jest.fn(async () => {
      return Promise.resolve();
    }),
  };
});

describe('makeGender()', () => {
  test('women to Womens', () => {
    expect(makeGender('women')).toStrictEqual(['Womens']);
  });

  test('men to Mens', () => {
    expect(makeGender('men')).toStrictEqual(['Mens']);
  });

  test('unisex to both genders', () => {
    expect(makeGender('unisex')).toStrictEqual(['Mens', 'Womens']);
  });

  test('log and return undefined when given odd parameter', () => {
    expect(makeGender('abcd')).toBe(undefined);
    expect(logBadProduct).toHaveBeenCalled();
  });
});
