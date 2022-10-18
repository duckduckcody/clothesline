import { getParams } from './getParams';

export const getCategoryAndGenderFromUrl = (url: string) => {
  const params = getParams(url);
  return {
    categories: params.get('category')?.split(',') || [],
    genders: params.get('gender')?.split(',') || [],
  };
};
