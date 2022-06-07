import { Category } from './Category';
import { Gender } from './Gender';

export type CategoryMap = Map<
  string,
  { category: Category[]; gender: Gender[] }
>;
