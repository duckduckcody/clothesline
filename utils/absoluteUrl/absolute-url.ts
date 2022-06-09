export const absoluteUrl = (
  url: string | null | undefined
): string | undefined => {
  if (!url) return undefined;
  if (url[0] === '/' && url[1] === '/') {
    return url.replace('//', 'https://');
  }
  return url;
};
