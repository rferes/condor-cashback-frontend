export function collection_view_messages(): {
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
      summary: 'Coleção de Produtos Atualizada',
      detail: 'Os dados foram atualizados com sucesso!',
      life: 4000,
    },
    201: {
      severity: 'success',
      summary: 'Coleção de Produtos Criada',
      detail: 'A Coleção de Produtos foi criado com sucesso!',
      life: 4000,
    },
    400: {
      severity: 'error',
      summary: 'Nome Duplicado',
      detail:
        'A Coleção não pôde ser registrada porque o nome fornecido já está associado a outra coleção de produtos de sua propriedade!',
      life: 4000,
    },
    404: {
      severity: 'error',
      summary: 'Coleção de Produtos não encontrado',
      detail: 'O id da coleção de produtos não foi encontrado!',
      life: 4000,
    },
    409: {
      severity: 'error',
      summary: 'Nome já cadastrado',
      detail:
        'A coleção não pôde ser registrada porque o nome fornecido já está associado a outra coleção de produtos de sua propriedade!',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
