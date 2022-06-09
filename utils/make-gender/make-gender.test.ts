import { logBadProduct } from '../logging';
import { makeGender } from './make-gender';

jest.mock('../logging');

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

  test('log and return undefined when given invalid parameter', () => {
    expect(makeGender('abcd')).toBe(undefined);
    expect(logBadProduct).toHaveBeenCalledWith({
      message: 'unknown gender response',
      gender: 'abcd',
    });
  });
});
