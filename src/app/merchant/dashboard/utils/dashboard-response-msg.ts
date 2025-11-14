export function dashboard_messages(): {
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
      summary: 'Dashboard Carregado',
      detail: 'Os dados do dashboard foram carregados com sucesso!',
      life: 4000,
    },
    404: {
      severity: 'warn',
      summary: 'Dados não encontrados',
      detail: 'Não foi possível carregar os dados do dashboard.',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
