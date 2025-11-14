export function store_group_view_messages(): {
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
      summary: 'Grupo de Lojas Atualizado',
      detail: 'Os dados foram atualizados com sucesso!',
      life: 4000,
    },
    201: {
      severity: 'success',
      summary: 'Grupo de Loja Criada',
      detail: 'O grupo de loja foi criado com sucesso!',
      life: 4000,
    },
    400: {
      severity: 'error',
      summary: 'Nome Duplicado',
      detail:
        'O grupo de loja não pôde ser registrado porque o nome fornecido já está associado a outro grupo de lojas de sua propriedade!',
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
      summary: 'Nome já cadastrado',
      detail:
        'O grupo de loja não pôde ser registrada porque o nome fornecido já está associado a outro grupo de lojas de sua propriedade!',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
