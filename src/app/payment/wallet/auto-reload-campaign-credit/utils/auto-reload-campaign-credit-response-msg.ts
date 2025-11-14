export function auto_reload_campaign_credits_messages(): {
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
      summary: 'Configurações Atualizada',
      detail: 'As configurações da carteira foram atualizadas com sucesso!',
      life: 4000,
    },
    402: {
      severity: 'error',
      summary: 'Não foi possível ativar Recarga',
      detail:
        'A recarga automática não pode ser ativada. Verifique se existe algum problema com seu cartão de crédito.',
      life: 6000,
    },
    406: {
      severity: 'error',
      summary: 'Não foi possível desativar Recarga',
      detail:
        'Para desativar a recarga automática você não pode ter nenhuma campanha ativa!',
      life: 6000,
    },
    424: {
      severity: 'warn',
      summary: 'Recarga Automática Desativada',
      detail: 'A recarga automática foi desativada com sucesso.',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
