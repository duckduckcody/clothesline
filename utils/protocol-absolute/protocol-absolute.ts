/**
 * replaces a protocol relative url (//) with a protocol absolute url (https://)
 * @param url
 * @returns protocol absolute url if valid url, undefined if not.
 */
export const protocolAbsolute = (
  url: string | null | undefined
): string | undefined => {
  if (!url) return undefined;
  if (url[0] === '/' && url[1] === '/') {
    return url.replace('//', 'https://');
  }
  return url;
};
