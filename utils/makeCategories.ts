import { Category, categorySchema } from '../types/Category';
import { logBadProduct } from './logging';

export const makeCategories = (
  c: string,
  loggingData?: object
): Category[] | undefined => {
  const category = c.toLocaleLowerCase();

  const categoryParse = categorySchema.safeParse(category);

  if (categoryParse.success) {
    return [categoryParse.data];
  } else {
    switch (category) {
      case 'sweatshirts':
      case 'fleeces':
        return ['jumpers'];
      case 'gilets':
        return ['jackets'];
      case 'dungarees':
        return ['jeans'];
      default:
        logBadProduct({
          message: 'Error making a category',
          category,
          loggingData,
        });
        return undefined;
    }
  }
};
