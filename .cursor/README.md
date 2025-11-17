# Frontend - Cursor Configuration

## 📂 Como usar esta pasta no Cursor

### Opção 1: Abrir APENAS frontend (RECOMENDADO)

```bash
# No terminal
cd /Users/rodrigoalmeidaferes/Documents/Work/CondorProject/frontend
cursor .
```

**Vantagens:**
- ✅ Git isolado (apenas frontend repo)
- ✅ Claude focado no frontend
- ✅ Configurações Angular/TypeScript específicas
- ✅ Mais rápido e leve

### Opção 2: Workspace multi-root

Se você REALMENTE precisa de backend + frontend na mesma janela, crie:

**CondorProject-Multi.code-workspace**
```json
{
  "folders": [
    {
      "name": "Backend",
      "path": "backend"
    },
    {
      "name": "Frontend",
      "path": "frontend"
    }
  ]
}
```

## 🔧 Configurações ativadas

- **TypeScript**: node_modules/typescript/lib
- **Formatação**: Prettier (single quotes, 2 spaces)
- **Linting**: ESLint
- **Angular**: Ivy mode, strict mode disabled
- **Git**: Frontend repo isolado
- **Claude context**: app-routing.module.ts, app.module.ts, angular.json

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Dev server
npm start
# ou
ng serve

# Build
npm run build

# Testes
npm test
```

## 🐛 Debug no VSCode/Cursor

Pressione **F5** e selecione:
- **Angular: Serve** - Inicia dev server e abre Chrome com debugging
- **Angular: Test** - Roda testes com debugging

---

**Última atualização**: Nov 2025
