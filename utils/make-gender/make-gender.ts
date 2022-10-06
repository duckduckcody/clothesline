import { Gender } from '../../types/Gender';
import { logBadProduct } from '../logging';

/**
 * convert a string or array into Gender[]
 * @param g gender string
 * @returns Gender[] or undefined if unrecognised string given
 */
export const makeGender = (g: string | string[]): Gender[] | undefined => {
  if (Array.isArray(g)) {
    return g.reduce<Gender[]>((prev, g) => {
      const gender = g.toLowerCase();
      if (gender === 'women' || gender === 'womens') {
        prev.push('Womens');
      } else if (gender === 'men' || gender === 'mens') {
        prev.push('Mens');
      } else if (gender === 'unisex') {
        prev.push('Womens');
        prev.push('Mens');
      } else {
        logBadProduct({ message: 'unknown gender response', gender });
      }

      return prev;
    }, []);
  }

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
