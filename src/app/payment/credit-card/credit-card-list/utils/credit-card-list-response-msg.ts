export function credit_card_list_messages(): {
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
      summary: 'Chaves Pix Carregadas',
      detail: 'Os dados foram carregados com sucesso!',
      life: 4000,
    },
    204: {
      severity: 'success',
      summary: 'Cartão de crédito apagado',
      detail: 'O cartão de crédito foi apagado com sucesso!',
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
      summary: 'Erro ao Carregar os cartões de créditos',
      detail: 'Os dados da tabela não pode ser carregados',
      life: 4000,
    },
    406: {
      severity: 'error',
      summary: 'Erro ao apagar cartão de crédito',
      detail:
        'O cartão esta vinculado a auto recarga, desative a auto recarga antes de apagar o cartão!',
      life: 5000,
    },
  };
}
