import { incrementPageParam } from './incrementPageParam';

describe('incrementPageParam', () => {
  test('add ?page=2 param to non url type strings', () => {
    expect(incrementPageParam('my-name-jeff')).toBe('my-name-jeff?page=2');
  });

  test('add ?page=2 param to url with no params', () => {
    expect(incrementPageParam('my-name-jeff.com')).toBe(
      'my-name-jeff.com?page=2'
    );
  });

  test('add page param and correct key when no params in provided url', () => {
    expect(incrementPageParam('my-name-jeff.com', 'p')).toBe(
      'my-name-jeff.com?p=2'
    );
  });

  test('increments set page param', () => {
    expect(incrementPageParam('my-name-jeff.com?page=44')).toBe(
      'my-name-jeff.com?page=45'
    );
  });

  test('correctly increments with multiple params including page', () => {
    expect(
      incrementPageParam(
        'my-name-jeff.com?ct=44&tr=44&store=aus&page=44&green=blue'
      )
    ).toBe('my-name-jeff.com?ct=44&tr=44&store=aus&page=45&green=blue');
  });

  test('correctly increments passed page key with multiple params including page', () => {
    expect(
      incrementPageParam(
        'my-name-jeff.com?ct=44&tr=44&store=aus&page=44&p=44&green=blue',
        'p'
      )
    ).toBe('my-name-jeff.com?ct=44&tr=44&store=aus&page=44&p=45&green=blue');
  });
});
