export function campaign_view_messages(): {
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
      summary: 'Campanha Atualizada com Sucesso',
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
      summary: 'Nome Duplicado',
      detail:
        'O Campanha não pôde ser registrado porque o nome fornecido já está associado a outra Campanhas de sua propriedade!',
      life: 4000,
    },
    404: {
      severity: 'error',
      summary: 'Campanhas não encontrado',
      detail: 'O id da Campanhas não foi encontrado!',
      life: 4000,
    },
    409: {
      severity: 'error',
      summary: 'Nome já cadastrado',
      detail:
        'O Campanha não pôde ser registrada porque o nome fornecido já está associado a outra Campanhas de sua propriedade!',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
