export function consumer_group_list_messages(): {
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
      summary: 'Grupos Carregados',
      detail: 'Os dados foram carregados com sucesso!',
      life: 4000,
    },
    201: {
      severity: 'success',
      summary: 'Grupo Criado',
      detail: 'O grupo foi criado com sucesso!',
      life: 4000,
    },
    204: {
      severity: 'success',
      summary: 'Grupo Deletado',
      detail: 'O grupo foi deletado com sucesso!',
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
      summary: 'Erro ao Carregar Grupos',
      detail: 'Os dados da tabela não pode ser carregados',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
