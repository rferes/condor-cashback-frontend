export function store_view_messages(): {
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
      summary: 'Loja Atualizada',
      detail: 'Os dados foram atualizados com sucesso!',
      life: 4000,
    },
    201: {
      severity: 'success',
      summary: 'Loja Criada',
      detail: 'A loja foi criada com sucesso!',
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
      summary: 'Loja não Encontrada',
      detail: 'O id da loja não foi encontrado!',
      life: 4000,
    },
    409: {
      severity: 'error',
      summary: 'CNPJ já cadastrado',
      detail:
        'A loja não pôde ser registrada porque o CNPJ fornecido já está associado a outra loja de sua propriedade!',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
