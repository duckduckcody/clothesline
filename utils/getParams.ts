export const getParams = (url: string) => {
  const splitUrl = url.split('?');
  return new URLSearchParams(splitUrl[1]);
};
