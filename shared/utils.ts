export const formatCurrency = (value: number) =>
  value.toLocaleString("en", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
