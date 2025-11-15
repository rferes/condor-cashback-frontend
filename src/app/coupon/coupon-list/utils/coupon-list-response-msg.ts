export function coupon_list_messages(): {
  [key: number]: {
    severity: string;
    summary: string;
    detail: string;
    life: number;
  };
} {
  return {
    200: {
      severity: 'success',
      summary: 'Cupons Carregados',
      detail: 'Os dados foram carregados com sucesso!',
      life: 4000,
    },
    400: {
      severity: 'error',
      summary: 'Campo Inválido',
      detail: 'Preencha os campos corretamente',
      life: 4000,
    },
    404: {
      severity: 'error',
      summary: 'Erro ao Carregar Cupons',
      detail: 'Os dados da tabela não podem ser carregados',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
