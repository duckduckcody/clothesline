import { RequestOptions } from 'crawlee';
import { CategoryMap } from '../../types/CategoryMap';

/**
 * adds category and gender from CategoryMap (using originalUrl as the key) to params of a request.url
 * @param request
 * @param categoryMap
 * @returns RequestOptions
 */
export const addCategoryGenderToRequest = (
  request: RequestOptions,
  categoryMap: CategoryMap
) => {
  const url = new URL(request.url);

  const key = request.url.split('?')[0];

  console.log('in here', key);

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

  console.log('request.url', request.url);

  return request;
};
