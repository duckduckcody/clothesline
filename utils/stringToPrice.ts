export const stringToPrice = (
  priceString: string | null | undefined
): number | undefined => {
  if (!priceString) return undefined;

  const price = parseFloat(
    priceString.replace('$', '').replace('AUD', '').replace(',', '').trim()
  );

  return isNaN(price) ? undefined : price;
};
