import { OptionsInit, Response } from 'got-scraping';

export type SendRequest = (
  overrideOptions?: Partial<OptionsInit>
) => Promise<Response<string>>;
