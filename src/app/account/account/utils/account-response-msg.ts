export function account_response(): {
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
      summary: 'Conta Atualizado',
      detail: 'Conta Atualizado com Sucesso',
      life: 4000,
    },
    400: {
      severity: 'error',
      summary: 'Campos inválidos ou vazios',
      detail: 'Preencha os campos corretamente',
      life: 4000,
    },
    409: {
      severity: 'error',
      summary: 'Conflito de dados',
      detail: 'O email ou celular já está em uso',
      life: 4000,
    },
    429: {
      severity: 'error',
      summary: 'Muitas requisições',
      detail:
        'Você realizou muitas requisições, aguarde e reenvie o código sms',
      life: 4000,
    },
    406: {
      severity: 'error',
      summary: 'Código inválido',
      detail: 'O código de verificação é inválido',
      life: 4000,
    },
  };
}
