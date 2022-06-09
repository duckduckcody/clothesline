import { RequestOptions } from 'apify';
import { CategoryMap } from '../../types/CategoryMap';

/**
 * adds category and gender from CategoryMap (using originalUrl as the key) to params of a request.url
 * @param originalUrl
 * @param categoryMap
 * @param request
 * @returns RequestOptions
 */
export const addCategoryGenderToRequest = (
  originalUrl: string,
  categoryMap: CategoryMap,
  request: RequestOptions
) => {
  const url = new URL(originalUrl);

  const key = `${url.protocol}//${url.host}`;

  const category = categoryMap.get(key)?.category;
  const gender = categoryMap.get(key)?.gender;

  if (category) {
    url.searchParams.set('category', category.toString());
  }

  if (gender) {
    url.searchParams.set('gender', gender.toString());
  }

  request.url = `${request.url}${
    url.searchParams.toString() ? `?${url.searchParams.toString()}` : ''
  }`;
  return request;
};
