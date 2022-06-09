import { CategoryMap } from '../../types/CategoryMap';
import { addCategoryGenderToRequest } from './add-category-gender-to-request';

describe('addCategoryGenderToRequest()', () => {
  it('does nothing if gender or category is not in map', () => {
    const categoryMap: CategoryMap = new Map();

    expect(
      addCategoryGenderToRequest('https://duck.com', categoryMap, {
        url: 'https://goose.com',
      })
    ).toEqual({ url: 'https://goose.com' });
  });

  it('adds single gender and single category', () => {
    const categoryMap: CategoryMap = new Map();
    categoryMap.set('https://duck.com', {
      category: ['hoodies'],
      gender: ['Mens'],
    });

    expect(
      addCategoryGenderToRequest('https://duck.com', categoryMap, {
        url: 'https://goose.com',
      })
    ).toEqual({ url: 'https://goose.com?category=hoodies&gender=Mens' });
  });

  it('adds multiple genders and multiple categories', () => {
    const categoryMap: CategoryMap = new Map();
    categoryMap.set('https://duck.com', {
      category: ['hoodies', 'shirts', 'shorts'],
      gender: ['Mens', 'Womens'],
    });

    expect(
      addCategoryGenderToRequest('https://duck.com', categoryMap, {
        url: 'https://goose.com',
      })
    ).toEqual({
      url: 'https://goose.com?category=hoodies%2Cshirts%2Cshorts&gender=Mens%2CWomens',
    });
  });

  it('handles originalUrl with already set params', () => {
    const categoryMap: CategoryMap = new Map();
    categoryMap.set('https://duck.com', {
      category: ['hoodies', 'shirts', 'shorts'],
      gender: ['Mens', 'Womens'],
    });

    expect(
      addCategoryGenderToRequest(
        'https://duck.com?mynamejeff=true',
        categoryMap,
        {
          url: 'https://goose.com',
        }
      )
    ).toEqual({
      url: 'https://goose.com?mynamejeff=true&category=hoodies%2Cshirts%2Cshorts&gender=Mens%2CWomens',
    });
  });
});
