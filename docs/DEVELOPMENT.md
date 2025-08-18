# Development Guide

## Overview

This document provides comprehensive development guidelines for the Pokémon Battle Royale application, including setup instructions, coding standards, testing procedures, and deployment workflows.

## Development Environment Setup

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Git**: Version 2.30.0 or higher
- **Code Editor**: VS Code (recommended) with TypeScript support

### Required VS Code Extensions

- **TypeScript and JavaScript Language Features**
- **ESLint**
- **Prettier**
- **Tailwind CSS IntelliSense**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

### Installation Steps

1. **Clone the Repository**
```bash
git clone <repository-url>
cd pokemon-battle-royale
```

2. **Install Dependencies**
```bash
npm install
```

3. **Verify Installation**
```bash
npm run lint
npm test
```

4. **Start Development Server**
```bash
npm start
```

## Project Structure

### Directory Organization

```
src/
├── app/                  # Application entry point
│   └── App.tsx           # Root component with providers
├── entities/             # Domain entities
│   └── pokemon/          # Pokémon entity
│       └── ui/           # Entity-specific UI components
├── features/             # Business features
│   └── voting/           # Voting system feature
│       ├── lib/          # Business logic hooks
│       └── ui/           # Feature-specific UI
├── pages/                # Page-level components
│   └── BattlePage.tsx    # Main battle page
├── shared/               # Shared utilities and components
│   ├── api/              # API client layer
│   ├── constants/        # Application constants
│   ├── dto/              # Data Transfer Objects
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── types/            # TypeScript definitions
│   └── ui/               # Reusable UI components
└── widgets/              # Complex UI compositions
    └── battle/           # Battle widget
        ├── lib/          # Battle management logic
        └── ui/           # Battle UI components
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `PokemonCard.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useVoting.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Types**: camelCase (e.g., `pokemon.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `pokemon.ts`)
- **Directories**: kebab-case (e.g., `pokemon-card/`)

## Code Quality

### ESLint Configuration

#### Rules
- Enforce TypeScript best practices
- Maintain consistent code style
- Prevent common mistakes
- Ensure accessibility standards

```json
// .eslintrc.json
{
  "extends": [
    "airbnb",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".tsx"] }],
    "import/extensions": ["error", "ignorePackages", { "ts": "never", "tsx": "never" }],
    "react/require-default-props": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

#### Code Formatting
- Consistent code style
- Automatic formatting
- Integration with ESLint
- Editor integration

## Deployment

### Build Process

#### Production Build
```bash
# Build for production
npm run build
```

#### Environment Configuration
```bash
# .env
REACT_APP_WS_URL=wss://ws.pokemon.com
```

### Deployment Platforms

#### Static Hosting
- **Vercel**: Automatic deployments from Git

#### Deployment Commands
```bash
# Vercel
vercel --prod
```

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

### Tools
- [Create React App](https://create-react-app.dev/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Jest](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)

### Best Practices
- [React Best Practices](https://react.dev/learn)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Performance Best Practices](https://web.dev/performance/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
