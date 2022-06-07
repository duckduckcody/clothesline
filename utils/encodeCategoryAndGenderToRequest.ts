import { RequestOptions } from 'apify';
import { CategoryMap } from '../types/CategoryMap';

export const encodeCategoryAndGenderToRequest = (
  url: string,
  categoryMap: CategoryMap,
  request: RequestOptions
) => {
  const baseUrl = url.split('?')[0];
  const params = new URLSearchParams();
  params.set('category', categoryMap.get(baseUrl)?.category.toString() || '');
  params.set('gender', categoryMap.get(baseUrl)?.gender.toString() || '');

  request.url = `${request.url}?${params.toString()}`;
  return request;
};
