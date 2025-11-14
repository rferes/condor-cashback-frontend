export function receipt_response(): {
  [key: number]: {
    severity: string;
    summary: string;
    detail: string;
    life: number;
  };
} {
  return {
    400: {
      severity: 'error',
      summary: 'Dados Inválidos',
      detail:
        'Os dados informados não são válidos, por favor, verifique os dados informados',
      life: 6000,
    },
    402: {
      severity: 'error',
      summary: 'Celular não é Válido',
      detail:
        'O celular informado não é válido, por favor, informe um número de celular válido',
      life: 6000,
    },
    403: {
      severity: 'error',
      summary: 'Email não é Válido',
      detail:
        'O email informado não é válido, por favor, informe um email válido',
      life: 6000,
    },
    405: {
      severity: 'error',
      summary: 'QR CODE Inválido',
      detail:
        'O qr code informado não é válido, por favor, informe um qr code válido de nota fiscal',
      life: 6000,
    },
    406: {
      severity: 'error',
      summary: 'Nota Fiscal Inválida',
      detail:
        'Não foi encontrada nenhuma campanha ativa desse influencer para a chave de acesso da nota fiscal enviada',
      life: 6000,
    },
    429: {
      severity: 'error',
      summary: 'Nota Fiscal já foi utilizada',
      detail:
        'A nota fiscal informada já foi utilizada em outra campanha, por favor, informe uma nota fiscal nova',
      life: 6000,
    },
    490: {
      severity: 'error',
      summary: 'Nota Fiscal não encontrada',
      detail: 'A nota fiscal informada não foi encontrada',
      life: 6000,
    },
    491: {
      severity: 'error',
      summary: 'CPF Inválido',
      detail: 'O CPF informado não é válido, por favor, informe um CPF válido',
      life: 6000,
    },
    200: {
      severity: 'success',
      summary: 'QR CODE lido com sucesso',
      detail: 'O código de acesso da nota fiscal foi lido com sucesso',
      life: 6000,
    },
    201: {
      severity: 'success',
      summary: 'Nota Fiscal Cadastrada',
      detail: 'Nota fiscal cadastrada com sucesso, aguarde a validação!',
      life: 6000,
    },
  };
}
