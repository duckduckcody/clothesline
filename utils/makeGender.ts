import { Gender } from '../types/Gender';
import { logBadProduct } from './logging';

export const makeGender = (g: string): Gender[] | undefined => {
  const gender = g.toLowerCase();
  if (gender === 'women' || gender === 'womens') {
    return ['Womens'];
  } else if (gender === 'men' || gender === 'mens') {
    return ['Mens'];
  } else if (gender === 'unisex') {
    return ['Mens', 'Womens'];
  } else {
    logBadProduct({ message: 'unknown gender response', gender });
    return undefined;
  }
};
