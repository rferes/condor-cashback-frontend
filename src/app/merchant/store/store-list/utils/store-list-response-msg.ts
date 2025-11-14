export function store_list_messages(): {
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
      summary: 'Lojas Carregadas',
      detail: 'Os dados foram carregados com sucesso!',
      life: 4000,
    },
    201: {
      severity: 'success',
      summary: 'Lojas Criadas!',
      detail: 'As lojas foram criadas com sucesso!',
      life: 4000,
    },
    204: {
      severity: 'success',
      summary: 'Lojas foram apagadas!',
      detail: 'As lojas foram deletadas com sucesso!',
      life: 4000,
    },
    400: {
      severity: 'error',
      summary: 'Loja não pode ser apagada!',
      detail:
        'A loja não pode ser apagada pois possui vendas associadas ou possui campanhas ativas',
      life: 4000,
    },
    404: {
      severity: 'error',
      summary: 'Erro ao Carregar Lojas',
      detail: 'Os dados da tabela não pode ser carregados',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
