import BigNumber from "bignumber.js";

export function isValidNumber(value: string | number): boolean {
  // eslint-disable-next-line no-restricted-globals
  return typeof value === "number" && isFinite(value);
}

export function formatCurrency(amount: string | number, decimalPlaces = 2) {
  const isValid = isValidNumber(Number(amount));
  if (!isValid) {
    return "0";
  }

  const sign = Number(amount) < 0 ? "-" : "";
  const absAmount = Math.abs(Number(amount));
  const integerPart = Math.floor(absAmount).toString();
  const decimalPart = BigNumber(absAmount % 1)
    .toFixed(decimalPlaces, BigNumber.ROUND_DOWN)
    .substring(1);
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );
  return (
    sign + formattedIntegerPart + (decimalPlaces > 0 ? `${decimalPart}` : "")
  );
}
