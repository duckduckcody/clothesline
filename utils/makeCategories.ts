import { Category, categorySchema } from '../types/Category';
import { logBadProduct } from './logging';

export const makeCategories = (
  c: string[],
  loggingData?: object
): Category[] | undefined => {
  const cats: Category[] = [];

  c.forEach((c) => {
    const category = c.toLowerCase();
    const categoryParse = categorySchema.safeParse(category);

    if (categoryParse.success) {
      cats.push(categoryParse.data);
    } else {
      switch (category) {
        case 'sweatshirts':
        case 'fleeces':
        case 'crewnecks':
        case 'knitwear':
          cats.push('jumpers');
          break;
        case 'gilets':
        case 'cardigan':
          cats.push('jackets');
          break;
        case 'dungarees':
          cats.push('jeans');
          break;
        case 'trackies':
          cats.push('trackpants');
          break;
        case 'skirt':
          cats.push('skirts');
          break;
        case 'basketball shorts':
        case 'denim shorts':
        case 'cargo shorts':
        case 'beach shorts':
          cats.push('shorts');
          break;
        case 'tees':
        case 'short sleeve tees':
        case 'long sleeve tees':
          cats.push('t-shirts');
          break;
        case 'button ups':
          cats.push('shirts');
          break;
        case 'bike shorts':
        case 'basketballshorts':
          cats.push('activewear', 'shorts');
          break;
        case 'jerseys':
          cats.push('activewear', 't-shirts');
          break;
        case 'outwear':
          cats.push('outerwear');
          break;
        case 'crop tee':
        case 'crops':
        case 'crop singlet':
          cats.push('crop-tops');
          break;
        case 'misc tops':
          cats.push('tops');
          break;
        case 'overalls':
          cats.push('outerwear');
          break;
        case 'muscles':
        case 'tank':
          cats.push('singlets');
          break;
        default:
          logBadProduct({
            message: 'Error making a category',
            category,
            loggingData,
          });
      }
    }
  });

  return cats;
};
