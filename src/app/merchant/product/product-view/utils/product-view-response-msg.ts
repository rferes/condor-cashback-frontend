export function product_view_messages(): {
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
      summary: 'Produto Atualizado',
      detail: 'Os dados foram atualizados com sucesso!',
      life: 4000,
    },
    201: {
      severity: 'success',
      summary: 'Produto Criado',
      detail: 'O produto foi criado com sucesso!',
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
      summary: 'Produto não Encontrado',
      detail: 'O id do produto não foi encontrado!',
      life: 4000,
    },
    409: {
      severity: 'error',
      summary: 'Nome de Produto já está cadastrado',
      detail:
        'O Nome do produto não pôde ser registrado porque o nome fornecido já está associado a outro produto de sua propriedade!',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
