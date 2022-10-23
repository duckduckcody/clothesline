import { Category } from '../../types/Category';
import { CategoryMap } from '../../types/CategoryMap';
import { Gender } from '../../types/Gender';

export const universalCategoryMap: CategoryMap = new Map();

export const addCategory = (
  url: string,
  category: Category[] | Category,
  gender: Gender[] | Gender
): void => {
  universalCategoryMap.set(`https://www.universalstore.com${url}.html`, {
    category: typeof category === 'string' ? [category] : category,
    gender: typeof gender === 'string' ? [gender] : gender,
  });
};

addCategory('/mens/clothing/t-shirts', 't-shirts', 'Mens');
addCategory('/mens/clothing/jeans', 'jeans', 'Mens');
addCategory('/mens/clothing/outerwear', ['hoodies', 'jackets'], 'Mens');
addCategory('/mens/clothing/shirts-polos', 'shirts', 'Mens');
addCategory('/mens/clothing/pants', 'pants', 'Mens');
addCategory('/mens/clothing/shorts', 'shorts', 'Mens');
addCategory('/mens/clothing/singlets', 'singlets', 'Mens');

addCategory('/womens/clothing/tops', 'tops', 'Womens');
addCategory('/womens/clothing/shirts', 'shirts', 'Womens');
addCategory('/womens/clothing/t-shirts', 't-shirts', 'Womens');
addCategory('/womens/clothing/jeans', 'jeans', 'Womens');
addCategory('/womens/clothing/dresses', 'dresses', 'Womens');
addCategory('/womens/clothing/outerwear', 'outerwear', 'Womens');
addCategory('/womens/clothing/pants', 'pants', 'Womens');
addCategory('/womens/clothing/skirts', 'skirts', 'Womens');
addCategory('/womens/clothing/shorts', 'shorts', 'Womens');
addCategory('/womens/clothing/sets-coordinates', 'co-ords', 'Womens');
addCategory('/womens/clothing/playsuits', 'playsuits', 'Womens');
addCategory('/womens/clothing/jumpsuits', 'playsuits', 'Womens');
addCategory('/womens/clothing/bodysuits', 'playsuits', 'Womens');
addCategory('/womens/clothing/overalls', 'playsuits', 'Womens');
addCategory('/womens/clothing/swim.html', 'swimwear', 'Womens');
