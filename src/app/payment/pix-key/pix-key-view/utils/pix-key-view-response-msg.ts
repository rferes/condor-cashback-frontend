export function pix_key_view_messages(): {
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
      summary: 'Chaves Pix Criada',
      detail: 'A Chaves Pix foi criado com sucesso!',
      life: 4000,
    },
    400: {
      severity: 'error',
      summary: 'Chave Pix não encontrada',
      detail: 'O código da Chave Pix não foi encontrado!',
      life: 4000,
    },
    404: {
      severity: 'error',
      summary: 'Chaves Pix não encontrado',
      detail: 'O id da Chaves Pix não foi encontrado!',
      life: 4000,
    },
    409: {
      severity: 'error',
      summary: 'Chave já cadastrado',
      detail:
        'A Chave não pôde ser registrada porque o código fornecido já está associado a outra Chave Pix de sua propriedade!',
      life: 4000,
    },
    499: {
      severity: 'error',
      summary: 'Chave Pix Inválida',
      detail: 'A Chave Pix fornecida é inválida!',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
