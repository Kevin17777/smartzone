export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
