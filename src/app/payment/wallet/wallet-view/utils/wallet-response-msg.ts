export function wallet_messages(): {
  [key: number]: {
    severity: string;
    summary: string;
    detail: string;
    life: number;
  };
} {
  return {
    // 200: {
    //   severity: 'success',
    //   summary: 'Configurações Atualizada',
    //   detail: 'As configurações da carteira foram atualizadas com sucesso!',
    //   life: 4000,
    // },
    202: {
      severity: 'success',
      summary: 'Resgate Realizado com sucesso',
      detail: 'O valor será transferido para sua conta',
      life: 4000,
    },
    400: {
      severity: 'error',
      summary: 'Erro ao realizar resgate',
      detail:
        'Ocorreu um erro ao realizar o resgate, por favor, tente novamente',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
