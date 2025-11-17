# CondorProject - Guia Completo para Claude

## 📌 Visão Geral

**CondorProject** é uma plataforma de **cashback e commerce** (RedAds) que conecta consumidores, merchants e influenciadores em um ecossistema integrado.

### Objetivos Principais
- 💳 Processamento de cashback em compras
- 🏪 Gerenciamento de lojas e merchants
- 👥 Parceria com influenciadores
- 💰 Sistema de créditos RED (moeda virtual)
- 📊 Dashboard de analytics e relatórios
- 🔐 Autenticação segura e gerenciamento de usuários

### Principais Atores
- **Consumidores**: Usam a plataforma para comprar e ganhar cashback
- **Merchants**: Lojas que oferecem produtos e pagam comissões
- **Influenciadores**: Promovem campanhas e ganham comissões
- **Managers**: Administram a plataforma (backend)

---

## 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Angular 17)                     │
│  - Login/Auth | Merchant Dashboard | Payment Management      │
│  - Influencer Panel | Consumer Pages | Admin Interfaces      │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST (JWT)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│               BACKEND (Django 4.2 + DRF 3.14)               │
│  - REST API (TokenAuth + JWT)                               │
│  - Core: Account | Campaign | Merchant | Payment | Receipt  │
│  - Services: Stark Bank | AWS S3 | Email/SES               │
│  - Database: MySQL (RDS)                                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
   ┌─────────┐        ┌─────────┐       ┌─────────┐
   │  MySQL  │        │ AWS S3  │       │ Stark   │
   │  (RDS)  │        │(Files)  │       │ Bank    │
   │         │        │         │       │(Payments)
   └─────────┘        └─────────┘       └─────────┘
```

### Fluxos Principais

#### 1. **Fluxo de Autenticação**
```
User Login → Account.views.login → JWT Token → Frontend armazena
Frontend → Todos os requests com header "Authorization: Bearer token"
```

#### 2. **Fluxo de Cashback/Pagamento**
```
Consumer Purchase → Payment.models.Transaction → Stark Bank Integration
                 → Receipt Processing (validação)
                 → RED Credits Distribution
```

#### 3. **Fluxo de Parcerias (Partnerships)**
```
Merchant ↔ Influencer Partnership → Campaign Management
         → Product Association → Commission Tracking
         → Payment Distribution
```

---

## 💻 Stack Técnico

### Backend
| Componente | Versão | Uso |
|-----------|--------|-----|
| **Python** | 3.9+ | Linguagem principal |
| **Django** | 4.2.26 | Framework web (atualizado 11/2025) |
| **DRF** | 3.16.1 | REST API (atualizado 11/2025) |
| **JWT** | 5.5.1 | Autenticação stateless (SimpleJWT) |
| **MySQL** | 8+ | Database (via PyMySQL) |
| **Boto3** | 1.40.74 | AWS SDK |
| **django-cors** | 4.3.1 | CORS handling |
| **Pillow** | 11.3.0 | Image processing |
| **reportlab** | 4.2.5 | PDF generation |
| **Stark Bank** | 2.26.0 | Payment processing |
| **WhiteNoise** | 6.11.0 | Static files (Phase 1.4) |
| **Debug Toolbar** | 6.1.0 | Performance profiling (dev only) |
| **colorama** | 0.4.6 | Terminal colors (test_performance) |

### Frontend
| Componente | Versão | Uso |
|-----------|--------|-----|
| **Node.js** | 20+ | Runtime |
| **Angular** | 17.0.0 | Framework principal |
| **TypeScript** | 5.2.2 | Linguagem |
| **RxJS** | 7.8.1 | Reactive programming |
| **PrimeNG** | 17.0.0 | UI Components |
| **Bootstrap** | 5.3.3 | CSS framework |
| **Chart.js** | 4.4.7 | Gráficos |
| **ZXing** | 0.21.2 | QR Code scanning |
| **ngx-mask** | 17.1.8 | Input masking |
| **ngx-image-cropper** | 7.2.1 | Image editing |

### Cloud & Infraestrutura
- **AWS RDS**: MySQL database
- **AWS S3**: File storage (media/banners)
- **AWS CloudWatch**: Logs e monitoring
- **AWS Lambda**: (optional) Functions
- **Stark Bank**: Payment processing
- **Docker**: Containerização
- **Nginx**: Reverse proxy

---

## 📁 Estrutura de Pastas (CRÍTICA)

### Backend - `/backend/`

```
backend/
├── backend/          # SETTINGS & CONFIG
│   ├── settings.py          # Django config (LEIA ISSO!)
│   ├── urls.py              # URL routing (rotas API)
│   ├── asgi.py / wsgi.py    # App entry points
│   ├── authenticator.py     # JWT + Auth customizado
│   ├── models.py            # Models globais
│   ├── routines.py          # Scheduled tasks/Cron
│   ├── util.py              # Utilitários globais
│   └── middleware/          # Custom middleware
│
├── account/                 # 👤 USER & AUTHENTICATION
│   ├── models.py           # User, Group, Profile models
│   ├── serializers.py      # UserSerializer, LoginSerializer
│   ├── views.py            # Login, Register, Password Reset
│   ├── urls.py             # /api/account/* rotas
│   └── migrations/         # Database migrations
│
├── manager/                 # 📊 CORE BUSINESS LOGIC
│   ├── models.py           # CHAVE! Models for Merchant/Campaign/Store
│   ├── serializers.py      # Manager data serialization
│   ├── views.py            # ViewSets para recursos
│   └── migrations/
│
├── merchant/               # 🏪 MERCHANT OPERATIONS
│   ├── models.py          # Merchant, Store models
│   ├── views.py           # Merchant CRUD & actions
│   └── migrations/
│
├── campaign/               # 📢 CAMPAIGN MANAGEMENT
│   ├── models.py          # Campaign, CampaignProduct models
│   ├── serializers.py     # Campaign data format
│   ├── views.py           # Campaign CRUD
│   └── migrations/
│
├── payment/                # 💳 PAYMENT PROCESSING
│   ├── models.py          # Transaction, Card, Wallet models
│   ├── stark_bank/        # IMPORTANTE! Stark Bank integration
│   │   ├── pix.py
│   │   ├── dict.py
│   │   └── utils.py
│   ├── views.py           # Payment endpoints
│   └── migrations/
│
├── receipt/                # 🧾 RECEIPT VALIDATION
│   ├── models.py          # Receipt model
│   ├── views.py           # Receipt upload & validation
│   └── migrations/
│
├── redcredits/             # 💎 RED CREDIT SYSTEM
│   ├── models.py          # RedCredit, Distribution
│   ├── views.py           # Credit operations
│   └── migrations/
│
├── consumer/               # 👥 CONSUMER DATA
│   ├── models.py          # Consumer profile
│   └── migrations/
│
├── influencer/             # 🌟 INFLUENCER MANAGEMENT
│   ├── models.py          # Influencer profile
│   └── migrations/
│
├── communication/          # 📧 EMAIL & NOTIFICATIONS
│   ├── models.py          # Communication logs
│   └── migrations/
│
├── product/                # 🛍️ PRODUCT CATALOG
│   ├── models.py          # Product models
│   └── migrations/
│
├── store/                  # 🏬 STORE MANAGEMENT
│   ├── models.py          # Store operations
│   └── migrations/
│
├── common/                 # 🔧 UTILITIES & SHARED
│   ├── models.py          # Common base models
│   ├── management/        # Management commands
│   └── migrations/
│
├── utils/                  # 🛠️ HELPER FUNCTIONS
│   └── *.py               # Utility modules
│
├── static/ & staticfiles/  # 🖼️ CSS, JS, images
├── media/                  # 📁 User uploads
├── templates/              # HTML templates (email)
├── logs/                   # 📋 Application logs
├── manage.py              # Django CLI
├── requirements.txt       # Python dependencies
└── README.md             # Backend documentation
```

### Frontend - `/frontend/`

```
frontend/
├── src/
│   ├── app/
│   │   ├── auth/                    # 🔐 LOGIN & REGISTRATION
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   │
│   │   ├── merchant/                # 🏪 MERCHANT DASHBOARD
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── partnership/         # Partnerships management
│   │   │   ├── store/
│   │   │   ├── product/
│   │   │   ├── api-keys/           # API credentials
│   │   │   ├── consumer/
│   │   │   ├── consumer-group/
│   │   │   ├── product-collection/
│   │   │   └── page/                # Landing pages
│   │   │
│   │   ├── influencer/              # 🌟 INFLUENCER PANEL
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   └── page/
│   │   │
│   │   ├── payment/                 # 💳 PAYMENT INTERFACES
│   │   │   ├── transaction/
│   │   │   ├── wallet/
│   │   │   ├── red-credit/
│   │   │   ├── red-comission/
│   │   │   ├── campaign-credit/
│   │   │   ├── credit-card/
│   │   │   ├── pix-key/
│   │   │   └── stark-bank/
│   │   │
│   │   ├── layout/                  # 🎨 LAYOUT & NAVIGATION
│   │   │   └── utils/
│   │   │
│   │   ├── core/                    # 🔧 CORE SERVICES (SE EXISTIR)
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   └── interceptors/
│   │   │
│   │   ├── shared/                  # 📦 SHARED COMPONENTS & PIPES (SE EXISTIR)
│   │   │   ├── components/
│   │   │   ├── pipes/
│   │   │   └── directives/
│   │   │
│   │   ├── app-routing.module.ts    # 🗺️ ROUTING PRINCIPAL
│   │   ├── app.module.ts            # ROOT MODULE
│   │   └── app.component.ts         # ROOT COMPONENT
│   │
│   ├── assets/                      # 🖼️ STATIC FILES
│   ├── styles/                      # 🎨 GLOBAL CSS/SCSS
│   ├── environments/                # 🔧 ENV CONFIGS
│   ├── index.html                   # Entry point
│   └── main.ts                      # Bootstrap
│
├── angular.json                     # Angular config
├── tsconfig.json                    # TypeScript config
├── package.json                     # Dependencies
└── README.md
```

### Raiz do Projeto - `/`

```
CondorProject/
├── .cursor/                    # 🤖 CURSOR/CLAUDE CONFIG
│   ├── claude.json            # THIS FILE!
│   ├── settings.json          # IDE settings
│   ├── commands/              # Custom slash commands
│   └── README.md
│
├── .vscode/                    # VSCode workspace config
├── config/                     # 🚀 DEPLOYMENT & INFRASTRUCTURE
│   ├── docker/               # Docker compose, Dockerfile
│   ├── nginx/                # Nginx configuration
│   ├── scripts/              # Deploy scripts
│   └── env/                  # Environment templates
│
├── Documentacao/              # 📚 Project documentation
├── Contratos/                 # 📄 Legal documents
├── README.md                  # Project overview
└── REMEDIATION_ROADMAP_*     # Bug fixes & improvements roadmap
```

---

## 🔑 Arquivos CRÍTICOS que Você Precisa Conhecer

### Backend
| Arquivo | Por Quê? | Quando Ler |
|---------|----------|-----------|
| `backend/settings.py` | Config global, database, AWS, JWT | Sempre que configurar algo |
| `backend/urls.py` | Todas as rotas da API | Para entender endpoints |
| `manager/models.py` | Core business logic models | Para entender dados |
| `account/views.py` | Authentication endpoints | Quando trabalhar com login |
| `payment/stark_bank/` | Payment integration | Quando trabalhar com pagamentos |
| `account/serializers.py` | Data validation | Quando validar requests |

### Frontend
| Arquivo | Por Quê? | Quando Ler |
|---------|----------|-----------|
| `app/app-routing.module.ts` | Todas as rotas do frontend | Para navegar na app |
| `app/merchant/partnership/` | Partnership logic (você abriu isso!) | Quando trabalhar com partnerships |
| `app/payment/` | Payment UI modules | Quando trabalhar com pagamentos |
| `app/auth/` | Login/Auth logic | Quando trabalhar com autenticação |
| `app/layout/` | Layout & navigation | Para entender estrutura visual |

---

## 🔐 Autenticação & Autorização

### Como Funciona
1. **Login** → `/api/account/login/` (POST)
   - Request: `{ email, password }`
   - Response: `{ access_token, refresh_token, user_id, ...}`

2. **Token JWT**
   - Backend usa `djangorestframework-simplejwt`
   - Todos requests: `Authorization: Bearer {token}`
   - Token expira automaticamente (verificar settings)

3. **Roles/Permissions**
   - `is_staff`: Admin da plataforma
   - `is_active`: Usuário ativo
   - Groups: Merchant, Influencer, Consumer, Manager

### Código Relevante
- **Backend**: `account/authenticator.py` + `account/views.py`
- **Frontend**: Interceptors em `app/core/` (se existir) ou `app/auth/`

---

## 📊 Modelos de Dados Principais

### Backend (models.py)

```
User (Django built-in)
├── Email, password, first_name, last_name
├── Groups (Merchant, Influencer, Consumer, Manager)
└── Timestamps (created_at, updated_at)

Consumer
├── user (FK)
├── cpf, phone
├── birth_date
└── preferences

Merchant
├── user (FK)
├── cnpj, store_name
├── address, phone
└── bank_account (Stark Bank integration)

Influencer
├── user (FK)
├── bio, social_media
├── followers_count
└── commission_percentage

Campaign
├── merchant (FK)
├── title, description
├── start_date, end_date
├── budget, commission_percent
└── products (M2M)

Product
├── merchant (FK)
├── sku, name, price
├── category, image
└── stock

Transaction
├── user (FK)
├── merchant (FK)
├── amount, status
├── payment_method (PIX, Card, etc)
├── stark_bank_id (external ref)
└── timestamp

Receipt
├── transaction (FK)
├── image (upload)
├── validation_status
└── validated_by

RedCredit
├── user (FK)
├── amount, balance
├── reason (cashback, commission, etc)
└── timestamp

Partnership
├── merchant (FK)
├── influencer (FK)
├── commission_percent
├── start_date, end_date
└── status
```

---

## 🔌 Integrações Externas

### 1. **Stark Bank** (Pagamentos)
- **Localização Backend**: `payment/stark_bank/`
- **Tipos**: PIX, TransferOut (transferências), Dict (chaves PIX)
- **Fluxo**:
  1. Frontend → Backend: Request de pagamento
  2. Backend → Stark Bank: Cria transação
  3. Stark Bank → Webhook: Notifica status
  4. Backend → Database: Atualiza transaction status

### 2. **AWS S3** (File Storage)
- **Config**: `backend/settings.py` (AWS_STORAGE_BUCKET_NAME)
- **Tipos**: Banners, imagens de produtos, uploads de usuário
- **Upload**: Via `blobImages.py`

### 3. **AWS RDS** (Database)
- **Tipo**: MySQL
- **Credenciais**: Via `.env` (RDS_HOST, RDS_USER, RDS_PASSWORD)
- **Backup**: Automático (AWS managed)

### 4. **Email/SES**
- **Servico**: AWS SES via `django-ses`
- **Uso**: Confirmação de email, reset de senha, notificações
- **Template**: Em `templates/email/`

---

## ⚡ Performance & Optimization (Phase 1.4 - Nov 2025)

### Caching Strategy (LocMemCache → Redis em Produção)

**5 endpoints otimizados com cache:**
```python
# merchant/views.py
@cache_page(60 * 5)  # 5 minutos
def dashboard_data(self, request, pk=None):
    # 13+ queries → RAM

@cache_page(60 * 10)  # 10 minutos
def get_partnership_guest_data(self, request, pk=None):

@cache_page(60 * 10)  # 10 minutos
def get_partnership_host_data(self, request, pk=None):

# product/views.py
@cache_page(60 * 15)  # 15 minutos
def list(self, request, *args, **kwargs):
    # Product catalog

# campaign/views.py
@cache_page(60 * 10)  # 10 minutos
def list(self, request, *args, **kwargs):
    # Campaign list
```

**Impacto:**
- Redução de ~98% nas queries em endpoints cacheados
- Tempo de resposta: <30ms para queries cacheadas
- **Nota**: Em PRODUCTION, usar Redis para suportar múltiplos workers

### Database Optimization (17 novos indexes)

**Indexes por modelo:**

```python
# payment/models.py - Transaction (5 indexes)
indexes = [
    models.Index(fields=['status']),
    models.Index(fields=['user', 'status']),  # Composite
    models.Index(fields=['user', 'user_mode']),  # Composite
    models.Index(fields=['external_id']),
    models.Index(fields=['-created_date']),  # Descending
]

# receipt/models.py - Receipt (4 indexes)
indexes = [
    models.Index(fields=['influencer']),
    models.Index(fields=['influencer', 'status']),  # Composite
    models.Index(fields=['access_key']),
    models.Index(fields=['-created_date']),
]

# redcredits/models.py - RedCredit & CampaignCredit (8 indexes)
# RedCredit (4 indexes)
indexes = [
    models.Index(fields=['consumer', 'status']),  # Composite
    models.Index(fields=['status']),
    models.Index(fields=['expiration_date']),
    models.Index(fields=['-created_date']),
]

# CampaignCredit (4 indexes)
indexes = [
    models.Index(fields=['merchant', 'status']),  # Composite
    models.Index(fields=['status']),
    models.Index(fields=['expiration_date']),
    models.Index(fields=['-created_date']),
]
```

**Performance Metrics (após otimizações):**
- Test 1 (Partnerships): 4 queries em 14.20ms ✅
- Test 2 (Transactions): 4 queries em 7.99ms ✅
- Test 3 (RedCredits): 5 queries em 7.48ms ✅
- **Total**: 13 queries em 29.67ms (EXCELLENT)

### Static Files (WhiteNoise)

**Configuração:**
- Middleware: `whitenoise.middleware.WhiteNoiseMiddleware`
- Storage: `whitenoise.storage.CompressedManifestStaticFilesStorage`
- 132 arquivos estáticos coletados
- 393 arquivos pós-processados (gzip)
- Funciona em LOCAL e PRODUCTION

**Arquivos importantes:**
- `backend/settings.py:85` - Middleware
- `backend/settings.py:251` - STATICFILES_STORAGE

### Performance Testing

**Management Command:**
```bash
# Testar performance
python manage.py test_performance

# Com output verboso
python manage.py test_performance --verbose
```

**Arquivo:** `common/management/commands/test_performance.py`

**Testes:**
1. Merchant Partnership Queries (select_related optimization)
2. Payment Transactions (index usage)
3. RED Credits (index usage + expiration queries)

### Debug Toolbar (LOCAL apenas)

**Acesso:** `http://localhost:8000/__debug__/`

**Uso:**
- Análise de queries SQL
- Verificar N+1 queries
- Cache hits/misses
- Performance profiling
- Template rendering time

**Configuração:** `backend/settings.py` (apenas quando `DJANGO_SETTINGS_MODE == 'LOCAL'`)

---

## 🛠️ Convenções de Código

### Backend (Django/Python)

**Naming Conventions:**
```python
# Models: PascalCase, Singular
class Transaction(models.Model):
    pass

# Fields: snake_case
created_at = models.DateTimeField(auto_now_add=True)

# Methods: snake_case
def get_total_revenue(self):
    pass

# Serializers: {Model}Serializer
class TransactionSerializer(serializers.ModelSerializer):
    pass

# Views: {Model}ViewSet ou {Action}APIView
class TransactionViewSet(viewsets.ModelViewSet):
    pass

# URLs: snake-case
path('api/transactions/', TransactionViewSet.as_view())
```

**Padrão DRF ViewSet:**
```python
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
```

**Error Handling:**
```python
from rest_framework.exceptions import ValidationError
raise ValidationError({'field': 'Error message'})
```

### Frontend (Angular/TypeScript)

**Naming Conventions:**
```typescript
// Components: {name}.component.ts
// Class: PascalCase
export class PartnershipListComponent {}

// Services: {name}.service.ts
// Class: {Action}Service
export class TransactionService {}

// Methods: camelCase
getTransactions(): Observable<Transaction[]> {}

// Variables: camelCase
private currentUser: User;
public transactions$: Observable<Transaction[]>;

// Interfaces: I{Name}
export interface ITransaction {
  id: number;
  amount: number;
}

// Pipes: {name}.pipe.ts
export class CurrencyFormatPipe {}
```

**Padrão Component:**
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from './transaction.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  loading$ = this.service.loading$;
  private destroy$ = new Subject<void>();

  constructor(private service: TransactionService) {}

  ngOnInit() {
    this.service.getTransactions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.transactions = data);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**HTTP Requests (usando HttpClient):**
```typescript
// No service
getTransactions(): Observable<Transaction[]> {
  return this.http.get<Transaction[]>('/api/transactions/');
}

// No component
this.service.getTransactions().subscribe(
  data => this.transactions = data,
  error => console.error('Erro:', error)
);
```

---

## 📚 Fluxos Comuns & Exemplos

### Adicionar Um Novo Endpoint de Pagamento

#### 1. Backend
```python
# payment/models.py
class CustomPaymentMethod(models.Model):
    name = models.CharField(max_length=100)
    # ... fields

# payment/serializers.py
class CustomPaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomPaymentMethod
        fields = '__all__'

# payment/views.py
class CustomPaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = CustomPaymentMethod.objects.all()
    serializer_class = CustomPaymentMethodSerializer
    permission_classes = [IsAuthenticated]

# backend/urls.py
from payment.views import CustomPaymentMethodViewSet
router.register(r'payment/methods', CustomPaymentMethodViewSet)
```

#### 2. Frontend
```typescript
// app/payment/payment.service.ts
getPaymentMethods(): Observable<PaymentMethod[]> {
  return this.http.get<PaymentMethod[]>('/api/payment/methods/');
}

// app/payment/[feature]/component.ts
export class PaymentComponent implements OnInit {
  methods$: Observable<PaymentMethod[]>;

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.methods$ = this.paymentService.getPaymentMethods();
  }
}

// Template
<div *ngFor="let method of methods$ | async">
  {{ method.name }}
</div>
```

### Adicionar Um Novo Campo em User

#### 1. Backend
```python
# account/models.py - NÃO EDITAR! User é Django built-in
# Criar um UserProfile separado:

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20)

# Criar migration:
python manage.py makemigrations
python manage.py migrate
```

#### 2. Frontend
- Atualizar interfaces
- Atualizar componentes que usam User
- Atualizar API calls se necessário

---

## 🚀 Como Fazer Bons Prompts para Claude

### ❌ RUIM
```
"Cria uma feature de payment"
"Me ajuda com o front"
"Como faz autenticação?"
```

### ✅ BOM
```
"Backend: Estou criando um novo ViewSet em payment/views.py
para processar transações PIX com Stark Bank.
O modelo Transaction já existe.
Me ajuda com o serializer e como integrar com stark_bank/pix.py"

"Frontend: No merchant/partnership/partnership-list.component.ts
preciso adicionar um filtro por status. Qual é a melhor prática
com RxJS e qual padrão vocês usam para filters nesse projeto?"

"Backend: Qual é a estrutura de UserProfile nesse projeto?
Quero adicionar um novo campo de 'preferred_currency'.
Já tem migrations rodando?"
```

### 📋 Checklist para Bons Prompts
- [ ] Especificar: **Backend** ou **Frontend** (ou ambos)
- [ ] Informar qual **arquivo** você está editando
- [ ] Descrever o **contexto**: qual feature, qual fluxo
- [ ] Mencionar **restrições**: precisa respeitar convenções, existem models/services relacionados
- [ ] Perguntar sobre **padrões**: Como fazem em outros places? Qual pattern usar?
- [ ] Se é um **erro**: Incluir o erro exato e arquivo

### Exemplo Completo
```
"Backend: Em `payment/stark_bank/pix.py` estou criando uma função
para validar chaves PIX. O projeto usa StarkBank para isso.

Pergunta 1: Como a validação é feita em outros lugares?
Deve retornar um boolean ou ValueError?

Pergunta 2: Preciso fazer cache dessa validação? Vi que o projeto
usa Django cache em outro lugar?

Context: Depois vou usar isso em `payment/views.py` num endpoint
POST `/api/payment/validate-pix-key/`"
```

---

## 🔍 Debugging & Troubleshooting

### Backend Issues
```bash
# Ver logs Django
tail -f logs/django.log

# Rodar migrations
python manage.py migrate

# Fazer migrações
python manage.py makemigrations

# Shell Django (DEBUG)
python manage.py shell
>>> from account.models import User
>>> User.objects.all()

# Testar endpoints
curl -H "Authorization: Bearer {token}" http://localhost:8000/api/...
```

### Frontend Issues
```bash
# Dev server
npm start

# Build
npm run build

# Testes
npm test

# Lint
npm run lint

# Ver network requests (DevTools F12)
```

### Docker
```bash
# Ver containers
docker ps

# Logs
docker logs {container_name}

# Entrar no container
docker exec -it {container_name} bash
```

---

## 📞 Contatos & Referências

- **Documentação Django**: https://docs.djangoproject.com
- **DRF Docs**: https://www.django-rest-framework.org
- **Angular Docs**: https://angular.io/docs
- **Stark Bank Docs**: https://starkbank.com/docs
- **AWS SDK**: https://boto3.amazonaws.com/v1/documentation

---

## 🎯 Quick Start para Novos Desenvolvedores

1. **Clone do repo e setup:**
   ```bash
   cd /Users/rodrigoalmeidaferes/Documents/Work/CondorProject

   # Backend
   cd backend
   python -m venv env
   source env/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver

   # Frontend (nova aba)
   cd frontend
   npm install
   npm start
   ```

2. **Leia estes arquivos PRIMEIRO:**
   - Este arquivo (`.claude/claude.md`)
   - `README.md` (raiz)
   - `backend/README.md` ou `backend/IDE_SETUP.md`
   - `frontend/README.md`

3. **Explore a arquitetura:**
   - Veja `backend/urls.py` para endpoints
   - Veja `frontend/src/app/app-routing.module.ts` para rotas
   - Abra `manager/models.py` para ver core models

4. **Quando pedir ajuda a Claude:**
   - Sempre cite o arquivo: "Em `account/views.py`..."
   - Especifique backend/frontend
   - Inclua o que já tentou
   - Pergunte sobre padrões usados no projeto

---

## 📝 Changelog

| Data | Autor | Mudança |
|------|-------|---------|
| 2025-11-15 | Claude | Documento inicial baseado em análise completa do projeto |

---

**Última atualização**: 15 de Novembro de 2025

**Versão**: 1.0

*Mantenha este documento atualizado conforme o projeto evolui!*
