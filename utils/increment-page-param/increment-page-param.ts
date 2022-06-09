/**
 * for a url increment its page param by 1 or set to 1 if no page value present
 * @param url
 * @param pageParamKey optional name of param key. Defaults to 'page'
 * @returns url with incremented page param value
 */
export const incrementPageParam = (
  url: string,
  pageParamKey: string = 'page'
) => {
  const parsedUrl = new URL(url);

  const currentPage = parsedUrl.searchParams.get(pageParamKey);
  parsedUrl.searchParams.set(
    pageParamKey,
    `${currentPage ? Number(currentPage) + 1 : 2}`
  );

  return parsedUrl.toString();
};
