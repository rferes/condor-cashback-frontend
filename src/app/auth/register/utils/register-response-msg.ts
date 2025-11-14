export function register_messages(): {
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
      summary: 'Conta Criada com Sucesso',
      detail:
        'Sua conta foi criada com sucesso, continue o processo de cadastro.',
      life: 4000,
    },
    400: {
      severity: 'error',
      summary: 'Campo Inválido',
      detail: 'Preencha os campos corretamente',
      life: 4000,
    },
    401: {
      severity: 'error',
      summary: 'Falha Na Autenticação',
      detail: 'Usuário ou senha incorretos!',
      life: 4000,
    },
    404: {
      severity: 'error',
      summary: 'Código Não Encontrado',
      detail: 'Código de verificação não encontrado!',
      life: 4000,
    },
    406: {
      severity: 'error',
      summary: 'Valor Incorreto',
      detail:
        'Um ou mais campos estão com valores incorretos! Verifique se o número do documento é válido.',
      life: 4000,
    },
  };
}
