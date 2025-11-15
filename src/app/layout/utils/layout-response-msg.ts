export function layout_messages(): {
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
      summary: 'Termos Aceitos',
      detail: 'Termos aceitos com sucesso!',
      life: 4000,
    },
    400: {
      severity: 'error',
      summary: 'Erro ao Aceitar Termos',
      detail: 'Erro ao aceitar os termos!',
      life: 4000,
    },
  };
}
