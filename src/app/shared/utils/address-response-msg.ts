export function address_by_cep_messages(): {
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
      summary: 'CEP Válido',
      detail:
        'O endereço foi completado automaticamente, finalize adicionando o número do endereço!',
      life: 4000,
    },
    400: {
      severity: 'error',
      summary: 'Campo Inválido',
      detail: 'Preencha o campo corretamente',
      life: 4000,
    },
    404: {
      severity: 'error',
      summary: 'CEP Inválido',
      detail: 'CEP não encontrado, digite um CEP válido!',
      life: 4000,
    },
  };
}
