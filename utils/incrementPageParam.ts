export const incrementPageParam = (
  url: string,
  pageParamKey: string = 'page'
) => {
  const splitUrl = url.split('?');
  const params = new URLSearchParams(splitUrl[1]);

  const currentPage = params.get(pageParamKey);
  params.set(pageParamKey, `${currentPage ? Number(currentPage) + 1 : 2}`);

  return `${splitUrl[0]}?${params.toString()}`;
};
