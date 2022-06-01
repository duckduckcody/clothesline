import striptags from 'striptags';

export const stripHtml = (html: string) =>
  striptags(html, [], ' ').trim().replace(/\s\s+/g, ' ');
