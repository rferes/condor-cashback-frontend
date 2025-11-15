export function forgot_password_messages(): {
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
      summary: 'Senha Redefinida',
      detail: 'Sua senha foi redefinida com sucesso!',
      life: 4000,
    },
    201: {
      severity: 'success',
      summary: 'Autenticação Em Duas Etapas',
      detail:
        'Foi enviado um código de verificação de 6 dígitos para o seu celular via SMS.',
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
      summary: 'Código Incorreto',
      detail: 'Código de verificação incorreto, tente novamente!',
      life: 4000,
    },
    429: {
      severity: 'error',
      summary: 'Muitas Tentativas',
      detail:
        'Código de verificação incorreto, muitas tentativas, tente novamente mais tarde!',
      life: 6000,
    },
    // Add more status codes as needed
  };
}
