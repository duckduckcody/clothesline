import { Category, categorySchema } from '../types/Category';
import { logBadProduct } from './logging';

export const makeCategories = (c: string): Category[] | undefined => {
  const category = c.toLocaleLowerCase();

  const categoryParse = categorySchema.safeParse(category);

  if (categoryParse.success) {
    return [categoryParse.data];
  } else {
    if (category === 'sweatshirts' || category === 'fleeces') {
      return ['jumpers'];
    } else {
      logBadProduct({ message: 'Error making a category', category });
      return undefined;
    }
  }
};
