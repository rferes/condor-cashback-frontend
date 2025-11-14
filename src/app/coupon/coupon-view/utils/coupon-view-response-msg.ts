export function coupon_view_messages(): {
  [key: number]: {
    severity: string;
    summary: string;
    detail: string;
    life: number;
  };
} {
  return {
    400: {
      severity: 'error',
      summary: 'Error ao carregar transação',
      detail:
        'Os dados da transação não puderam ser carregados. Por favor, tente novamente.',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
