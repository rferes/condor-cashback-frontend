# Condor Cashback - Frontend

Frontend web application for the Condor Cashback platform built with Angular 15.

## Overview

This is the customer-facing web application for the Condor Cashback platform, providing interfaces for:

- **Consumers**: Browse campaigns, view available coupons, and track cashback rewards
- **Merchants**: Manage campaigns, products, collections, and store groups
- **Influencers**: Create partnerships, manage profiles, and track commissions

## Tech Stack

- **Framework**: Angular 15.2.10
- **Language**: TypeScript
- **Build Tool**: Angular CLI
- **Package Manager**: npm
- **Architecture**: Modular/Feature-based structure

## Prerequisites

- Node.js (14+)
- npm (6+)
- Angular CLI (15+)

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/rferes/condor-cashback-frontend.git
cd condor-cashback-frontend

# Install dependencies
npm install
```

### Development Server

```bash
# Start the development server
ng serve

# Or with port specification
ng serve --port 4200
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify any source files.

### Code Scaffolding

Generate new components, services, and other Angular artifacts:

```bash
# Generate a new component
ng generate component component-name

# Generate a service
ng generate service service-name

# Generate other artifacts
ng generate directive|pipe|service|class|guard|interface|enum|module
```

## Building for Production

```bash
# Build the project
ng build

# Build artifacts will be stored in the 'dist/' directory
```

### Build Configurations

```bash
# Development build
ng build --configuration development

# Production build (optimized)
ng build --configuration production

# Sandbox environment
ng build --configuration sandbox
```

## Testing

### Unit Tests

```bash
# Run unit tests via Karma
ng test

# Run tests with coverage
ng test --code-coverage
```

### End-to-End Tests

```bash
# Run e2e tests
ng e2e
```

## Project Structure

```text
src/
├── app/
│   ├── account/          # User account management
│   ├── auth/             # Authentication (login, register, forgot-password)
│   ├── campaign/         # Campaign features
│   ├── coupon/           # Coupon management
│   ├── influencer/       # Influencer-specific features
│   ├── merchant/         # Merchant-specific features
│   ├── payment/          # Payment and wallet management
│   ├── receipt/          # Receipt management
│   ├── shared/           # Shared services and utilities
│   ├── layout/           # Layout components
│   └── utils/            # Guards, interceptors, helpers
├── assets/               # Static assets
├── environments/         # Environment configurations
├── styles/              # Global styles
└── index.html
```

## Key Features

- **Authentication**: Login, registration, password reset with email/SMS verification
- **Campaign Management**: Create, edit, and manage campaigns
- **Payment Processing**: Credit card and PIX payment methods
- **Credit System**: Track RED credits and commissions
- **Receipt Management**: Upload and validate receipts
- **User Roles**: Support for merchants, influencers, and consumers

## Environment Configuration

Create environment-specific files in `src/environments/`:

- `environment.ts` - Development
- `environment.development.ts` - Dev server
- `environment.prod.ts` - Production
- `environment.sandbox.ts` - Sandbox

## API Integration

The frontend communicates with the backend API. Ensure the backend is running before starting the development server.

Update the API endpoint in environment files as needed.

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

Proprietary - Condor Cashback

## Author

**Rodrigo Feres**
Initial Release: 2024
