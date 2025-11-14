export function merchant_response(): {
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
      summary: 'Profile Atualizado',
      detail: 'Profile do Comerciante Atualizado com Sucesso',
      life: 4000,
    },
    201: {
      severity: 'success',
      summary: 'Profile Criado',
      detail: 'Profile do Influencer Criado com Sucesso',
      life: 4000,
    },
    202: {
      severity: 'success',
      summary: 'Termos Aceitos',
      detail: 'Termos Aceitos com Sucesso',
      life: 4000,
    },
    400: {
      severity: 'error',
      summary: 'Campos inválidos ou vazios',
      detail: 'Preencha os campos corretamente',
      life: 4000,
    },
    401: {
      severity: 'error',
      summary: 'Erro ao aceitar os termos',
      detail: 'Erro ao aceitar os termos',
      life: 4000,
    },
  };
}
