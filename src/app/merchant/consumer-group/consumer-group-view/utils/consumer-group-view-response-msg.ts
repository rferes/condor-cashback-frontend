export function consumer_group_view_messages(): {
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
      summary: 'Grupo Atualizado',
      detail: 'Os dados foram atualizados com sucesso!',
      life: 4000,
    },
    201: {
      severity: 'success',
      summary: 'Grupo de Consumidores Criada',
      detail: 'O grupo de Consumidores foi criado com sucesso!',
      life: 4000,
    },
    400: {
      severity: 'error',
      summary: 'Nome do Grupo Duplicado',
      detail:
        'O grupo de consumidores não pôde ser registrado porque o nome fornecido já está associado a outro grupo de consumidores de sua propriedade!',
      life: 4000,
    },
    404: {
      severity: 'error',
      summary: 'Grupo de Lojas não encontrado',
      detail: 'O id do grupo de lojas não foi encontrado!',
      life: 4000,
    },
    409: {
      severity: 'error',
      summary: 'Nome do Grupo já cadastrado',
      detail:
        'O grupo de consumidores não pôde ser registrada porque o nome fornecido já está associado a outro grupo de consumidores de sua propriedade!',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
