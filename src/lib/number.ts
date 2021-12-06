export const digits = (num: number, base = 10): number[] => {
  const d: number[] = [];
  for (let n = Math.floor(Math.abs(num)); n > 0; n = Math.floor(n / base))
    d.push(n % base);
  return d;
};
