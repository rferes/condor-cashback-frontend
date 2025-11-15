export function influencer_view_messages(): {
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
      summary: 'Influenciador encontrado',
      detail: 'Os dados foram carregados com sucesso!',
      life: 4000,
    },
    201: {
      severity: 'success',
      summary: 'Influenciador adicionado',
      detail: 'O influenciador foi adicionado à sua lista de favoritos.',
      life: 4000,
    },
    202: {
      severity: 'success',
      summary: 'Convite Enviado',
      detail:
        'O convite foi enviado para o email informado. Aguarde o cadastramento do influenciador na plataforma.',
      life: 4000,
    },
    204: {
      severity: 'success',
      summary: 'Influenciador removido',
      detail: 'O influenciador foi deletado da sua lista de favoritos.',
      life: 4000,
    },
    404: {
      severity: 'warn',
      summary: 'Influenciador não encontrado',
      detail: 'Esse influenciador não tem nenhuma nota fiscal associado.',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
