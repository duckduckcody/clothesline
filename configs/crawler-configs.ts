import { CrawlerConfig } from '../types/CrawlerConfig';
import { coolShirtzConfig } from './cool-shirtz-config';
import { cultureKingsConfig } from './culture-kings-config';
import { edgeClothingConfig } from './edge-clothing/edge-clothing-config';
import { universalConfig } from './universal/universal-config';

export const crawlerConfigs: CrawlerConfig[] = [
  coolShirtzConfig,
  cultureKingsConfig,
  edgeClothingConfig,
  universalConfig,
];
