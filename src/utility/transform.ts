

export const formatIndex = function (index: number): string {
  const displayNumber = index + 1; // 因為你希望從 01 開始
  return displayNumber < 10 ? `0${displayNumber}` : `${displayNumber}`;
}