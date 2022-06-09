import { incrementPageParam } from './increment-page-param';

describe('incrementPageParam', () => {
  test('add ?page=2 param to non url type strings', () => {
    expect(incrementPageParam('https://duck.com')).toBe(
      'https://duck.com/?page=2'
    );
  });

  test('add ?page=2 param to url with no params', () => {
    expect(incrementPageParam('https://duck.com.com')).toBe(
      'https://duck.com.com/?page=2'
    );
  });

  test('add page param and correct key when no params in provided url', () => {
    expect(incrementPageParam('https://duck.com.com', 'p')).toBe(
      'https://duck.com.com/?p=2'
    );
  });

  test('increments set page param', () => {
    expect(incrementPageParam('https://duck.com.com?page=44')).toBe(
      'https://duck.com.com/?page=45'
    );
  });

  test('correctly increments with multiple params including page', () => {
    expect(
      incrementPageParam(
        'https://duck.com.com?ct=44&tr=44&store=aus&page=44&green=blue'
      )
    ).toBe('https://duck.com.com/?ct=44&tr=44&store=aus&page=45&green=blue');
  });

  test('correctly increments passed page key with multiple params including page', () => {
    expect(
      incrementPageParam(
        'https://duck.com.com?ct=44&tr=44&store=aus&page=44&p=44&green=blue',
        'p'
      )
    ).toBe(
      'https://duck.com.com/?ct=44&tr=44&store=aus&page=44&p=45&green=blue'
    );
  });
});
