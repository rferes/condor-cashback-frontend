export function campaign_list_messages(): {
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
      summary: 'Campanhas Carregados',
      detail: 'Os dados foram carregados com sucesso!',
      life: 4000,
    },
    204: {
      severity: 'success',
      summary: 'Campanha Apagada com Sucesso',
      detail: 'A campanha foi apagada com sucesso!',
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
      summary: 'Erro ao Carregar Campanhas',
      detail: 'Os dados da tabela não pode ser carregados',
      life: 4000,
    },
    406: {
      severity: 'error',
      summary: 'Campanha não pode ser reativada',
      detail:
        'A campanha não pode ser reativada, pois o usario está com o carregamento de campanha desativado',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
