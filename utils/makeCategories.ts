import { Category, categorySchema } from '../types/Category';
import { logBadCategory } from './logging';

export const makeCategories = (
  c: string[],
  loggingData?: object
): Category[] | undefined => {
  const cats: Category[] = [];

  c.forEach((c) => {
    const category = c.toLowerCase().replaceAll('-', ' ');
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
        case 't shirts':
        case 'short sleeve tees':
          cats.push('t-shirts');
          break;
        case 'long sleeve tees':
        case 'longsleeve':
          cats.push('long sleeve tees');
          break;
        case 'button ups':
        case 'button up shirts':
        case 'party shirt':
          cats.push('shirts');
          break;
        case 'active bra':
          cats.push('activewear');
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
        case 'crop tops':
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
          logBadCategory(category);
      }
    }
  });

  return cats;
};
