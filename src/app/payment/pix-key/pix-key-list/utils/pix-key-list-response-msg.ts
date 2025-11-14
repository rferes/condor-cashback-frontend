export function pix_key_list_messages(): {
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
      summary: 'Chaves Pix Deletadas',
      detail: 'As chaves pix foram deletadas com sucesso!',
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
      summary: 'Erro ao Carregar as Chaves Pix',
      detail: 'Os dados da tabela não pode ser carregados',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
