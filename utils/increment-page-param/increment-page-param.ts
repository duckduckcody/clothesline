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
