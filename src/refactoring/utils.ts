export function convertToLocaleString(num: number): string {
  return num.toLocaleString();
}
export function getPercent(소수: number) {
  return 소수 * 100;
}

export function getFullNumberPercent(소수: number) {
  return getPercent(소수).toFixed(0);
}
