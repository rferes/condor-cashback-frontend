export function product_list_messages(): {
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
      summary: 'Produtos Carregadas',
      detail: 'Os dados foram carregados com sucesso!',
      life: 4000,
    },
    201: {
      severity: 'success',
      summary: 'Produtos Criados',
      detail: 'Os produtos foram criados com sucesso!',
      life: 4000,
    },
    204: {
      severity: 'success',
      summary: 'Produtos Deletados',
      detail: 'Os produtos foram deletados com sucesso!',
      life: 4000,
    },
    400: {
      severity: 'error',
      summary: 'Produto não pode ser apagado!',
      detail:
        'O Produto não pode ser apagado pois possui vendas associadas ou possui campanhas ativas',
      life: 4000,
    },
    404: {
      severity: 'error',
      summary: 'Erro ao Carregar Grupos de Lojas',
      detail: 'Os dados da tabela não pode ser carregados',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
