export const convertToLocaleString = (num: number): string =>
  num.toLocaleString();

export const getPercent = (소수: number) => 소수 * 100;

export const getWholeNumberPercent = (소수: number) =>
  getPercent(소수).toFixed(0);
