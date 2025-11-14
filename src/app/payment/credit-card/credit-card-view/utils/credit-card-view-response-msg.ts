export function credit_card_view_messages(): {
  [key: number]: {
    severity: string;
    summary: string;
    detail: string;
    life: number;
  };
} {
  return {
    201: {
      severity: 'success',
      summary: 'Cartão de Crédito Criado',
      detail: 'O Cartão de Crédito foi criado com sucesso!',
      life: 4000,
    },
    400: {
      severity: 'error',
      summary: 'Cartão de Crédito Inválido',
      detail: 'Preencha os campos corretamente',
      life: 4000,
    },
    404: {
      severity: 'error',
      summary: 'Cartão de Crédito não encontrado',
      detail: 'O id do Cartão de Crédito não foi encontrado',
      life: 4000,
    },
    409: {
      severity: 'error',
      summary: 'Cartão de Crédito já existe',
      detail:
        'O Cartão de Crédito já existe, por favor, insira um Cartão de Crédito diferente',
      life: 4000,
    },
    499: {
      severity: 'error',
      summary: 'Cartão de Crédito não é válido',
      detail:
        'Verifique os dados inseridos, um ou mais campo deve estar com errors',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
