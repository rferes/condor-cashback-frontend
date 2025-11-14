export function partnership_list_messages(): {
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
      summary: 'Parceiro encontrado',
      detail: 'Os dados foram carregados com sucesso!',
      life: 4000,
    },
    201: {
      severity: 'success',
      summary: 'Parceiro adicionado',
      detail: 'O parceiro foi adicionado à sua lista de favoritos.',
      life: 4000,
    },
    202: {
      severity: 'success',
      summary: 'Convite Enviado',
      detail:
        'O convite foi enviado para o email informado. Aguarde o cadastramento do parceiro na plataforma.',
      life: 4000,
    },
    204: {
      severity: 'success',
      summary: 'Parceiro removido',
      detail: 'O parceiro foi deletado da sua lista de favoritos.',
      life: 4000,
    },
    400: {
      severity: 'warn',
      summary: 'Parceiro não encontrado',
      detail: 'Esse parceiro não tem nenhuma nota fiscal associado.',
      life: 4000,
    },
    406: {
      severity: 'warn',
      summary: 'Não é possível adicionar você mesmo',
      detail: 'Você não pode adicionar você mesmo como parceiro.',
      life: 4000,
    },
    409: {
      severity: 'warn',
      summary: 'Parceiro já cadastrado',
      detail: 'O parceiro já está cadastrado na sua lista de favoritos.',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
