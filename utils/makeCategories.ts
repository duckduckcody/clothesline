import { Category, categorySchema } from '../types/Category';
import { logBadProduct } from './logging';

export const makeCategories = (
  c: string[],
  loggingData?: object
): Category[] | undefined => {
  const categories: Category[] = [];

  c.forEach((c) => {
    const category = c.toLowerCase();

    const categoryParse = categorySchema.safeParse(category);

    if (categoryParse.success) {
      categories.push(categoryParse.data);
    } else {
      switch (category) {
        case 'sweatshirts':
        case 'fleeces':
          categories.push('jumpers');
        case 'gilets':
          categories.push('jackets');
        case 'dungarees':
          categories.push('jeans');
        default:
          logBadProduct({
            message: 'Error making a category',
            category,
            loggingData,
          });
      }
    }
  });

  return categories;
};
