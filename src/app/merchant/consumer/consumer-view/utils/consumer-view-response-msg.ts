export function consumer_view_messages(): {
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
      summary: 'Consumidor Encontrado',
      detail: 'Os dados foram carregados com sucesso!',
      life: 4000,
    },
    404: {
      severity: 'warn',
      summary: 'Consumidor não encontrado',
      detail: 'Esse consumidor não tem nenhuma nota fiscal associado.',
      life: 4000,
    },
    // Add more status codes as needed
  };
}
