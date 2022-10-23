import { Category } from '../../types/Category';
import { CategoryMap } from '../../types/CategoryMap';
import { Gender } from '../../types/Gender';

export const EdgeClothingCategoryMap: CategoryMap = new Map();

export const addCategory = (
  url: string,
  category: Category[] | Category,
  gender: Gender[] | Gender
): void => {
  EdgeClothingCategoryMap.set(
    `https://www.edgeclothing.com.au/collections${url}`,
    {
      category: typeof category === 'string' ? [category] : category,
      gender: typeof gender === 'string' ? [gender] : gender,
    }
  );
};

addCategory('/mens-t-shirts', 't-shirts', 'Mens');
addCategory('/mens-tanks', 'singlets', 'Mens');
addCategory('/mens-singlets', 'singlets', 'Mens');
addCategory('/mens-shirts', 'shirts', 'Mens');
addCategory('/mens-long-sleeve-tees-1', 'long sleeve tees', 'Mens');
addCategory('/mens-denim', 'jeans', 'Mens');
addCategory('/mens-pants', 'pants', 'Mens');
addCategory('/mens-track-pants', 'trackpants', 'Mens');
addCategory('/mens-shorts', 'shorts', 'Mens');
addCategory('/mens-hoodies', 'hoodies', 'Mens');
addCategory('/mens-jackets', 'jackets', 'Mens');
addCategory('/mens-jumpers', 'jumpers', 'Mens');
addCategory('/mens-knitwear', 'jumpers', 'Mens');
addCategory('/mens-fleece-1', 'jumpers', 'Mens');

addCategory('/womens-dresses', 'dresses', 'Womens');
addCategory('/womens-t-shirts', 't-shirts', 'Womens');
addCategory('/womens-short-sleeve-tees-1', 't-shirts', 'Womens');
addCategory('/womens-tanks', 'singlets', 'Womens');
addCategory('/womens-denim-1', 'jeans', 'Womens');
addCategory('/womens-pants', 'pants', 'Womens');
addCategory('/womens-track-pants', 'trackpants', 'Womens');
addCategory('/womens-skirts', 'skirts', 'Womens');
addCategory('/womens-shorts', 'shorts', 'Womens');
addCategory('/womens-hoodies', 'hoodies', 'Womens');
addCategory('/womens-jackets', 'jackets', 'Womens');
addCategory('/womens-jumpers', 'jumpers', 'Womens');
addCategory('/womens-knitwear', 'jumpers', 'Womens');
addCategory('/womens-fleece-1', 'jumpers', 'Womens');
addCategory('/womens-bodysuits', 'playsuits', 'Womens');
