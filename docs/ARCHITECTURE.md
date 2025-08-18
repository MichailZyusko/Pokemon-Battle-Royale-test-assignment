# Architecture Documentation

## Overview

The Pokémon Battle Royale application follows a modern React architecture with TypeScript, emphasizing clean code organization, type safety, and maintainability. The application is built using a feature-based architecture that promotes separation of concerns and reusability.

## Core Architecture Principles

### 1. Feature-Based Organization
- **Entities**: Core business objects (Pokémon)
- **Features**: Business logic modules (voting system)
- **Widgets**: Complex UI compositions
- **Shared**: Reusable utilities and components
- **Pages**: Route-level components

### 2. Type Safety
- Comprehensive TypeScript usage throughout
- Strict type definitions for all data structures
- Interface-based contracts for components
- Generic types for reusable utilities

### 3. State Management
- React Query for server state management
- Local state with React hooks
- Custom hooks for complex state logic
- Immutable state updates

## Directory Structure

```
src/
├── app/                  # Application initialization
│   └── App.tsx           # Root component with providers
├── entities/             # Domain entities
│   └── pokemon/          # Pokémon entity
│       └── ui/           # Pokémon-specific UI components
├── features/             # Business features
│   └── voting/           # Voting system feature
│       ├── lib/          # Business logic hooks
│       └── ui/           # Feature-specific UI
├── pages/                # Page-level components
│   └── BattlePage.tsx    # Main battle page
├── shared/               # Shared utilities
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

## Component Architecture

### Component Hierarchy

```
App
└── BattlePage
    └── BattleWidget
        └── VotingInterface
            ├── PokemonCard (multiple)
            ├── VotingResultsTable
            └── Voting Controls
```

### Component Responsibilities

#### App Component
- **Purpose**: Application root with global providers
- **Responsibilities**:
  - QueryClient provider setup
  - Toast notifications
  - Global state providers

#### BattlePage Component
- **Purpose**: Page-level container
- **Responsibilities**:
  - Page layout and structure
  - Component composition

#### BattleWidget Component
- **Purpose**: Main battle orchestration
- **Responsibilities**:
  - Battle state management
  - Loading and error states
  - Component coordination

#### VotingInterface Component
- **Purpose**: Core voting functionality
- **Responsibilities**:
  - Vote handling and validation
  - Real-time updates
  - User interaction management

## Data Flow Architecture

### 1. Data Fetching
```
API Request → React Query → Component State → UI Update
```

### 2. Voting Flow
```
User Selection → Local State → Vote Submission → WebSocket → Real-time Update
```