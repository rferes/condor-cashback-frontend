export function campaign_edit_view_messages(): {
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
      summary: 'Campanha Atualizado',
      detail: 'Os dados foram atualizados com sucesso!',
      life: 4000,
    },
    201: {
      severity: 'success',
      summary: 'Campanha Criada',
      detail: 'A Campanha foi criado com sucesso!',
      life: 4000,
    },
    400: {
      severity: 'error',
      summary: 'Campanha com dados inválidos',
      detail:
        'A Campanha não pôde ser registrada porque os dados fornecidos são inválidos!',
      life: 4000,
    },
    404: {
      severity: 'error',
      summary: 'Campanha não encontrado',
      detail: 'O id da Campanha não foi encontrado!',
      life: 4000,
    },
    409: {
      severity: 'error',
      summary: 'Campanha com nome duplicado',
      detail:
        'A Campanha não pôde ser registrada porque o nome fornecido já existe!',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
