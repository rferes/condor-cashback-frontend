export function api_keys_list_messages(): {
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
      summary: 'Chave API encontrada',
      detail: 'Os dados foram carregados com sucesso!',
      life: 4000,
    },
    201: {
      severity: 'success',
      summary: 'Chave API criada',
      detail: 'A chave API foi criada com sucesso.',
      life: 4000,
    },
    204: {
      severity: 'success',
      summary: 'Chave API removida',
      detail: 'A chave API foi removida com sucesso.',
      life: 4000,
    },
    400: {
      severity: 'warn',
      summary: 'Chave API não encontrada',
      detail: 'A chave API solicitada não foi encontrada.',
      life: 4000,
    },
    409: {
      severity: 'warn',
      summary: 'Chave API já existe',
      detail: 'Uma chave API com este nome já existe.',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
