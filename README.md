# Pokémon Battle Royale

A real-time voting application where users can participate in Pokémon battles and watch live voting results from users worldwide.

## 🚀 Features

- **Real-time Voting**: Live voting system with WebSocket integration
- **Interactive Battle Interface**: Beautiful Pokémon card selection interface
- **Live Results**: Real-time vote counting and statistics
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Duplicate Vote Prevention**: Smart detection of duplicate votes across tabs
- **Battle Management**: Start new battles with random Pokémon selections
- **Connection Status**: Real-time connection monitoring with visual feedback

## 🏗️ Architecture

The application follows a feature-based architecture with clear separation of concerns:

```
src/
├── app/                   # Application entry point
├── entities/              # Domain entities (Pokémon)
├── features/              # Feature modules (voting system)
├── pages/                 # Page components
├── shared/                # Shared utilities and components
│   ├── api/               # API client and endpoints
│   ├── constants/         # Application constants
│   ├── dto/               # Data Transfer Objects
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── types/             # TypeScript type definitions
│   └── ui/                # Reusable UI components
└── widgets/               # Complex UI compositions
```

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS with custom components
- **Real-time**: WebSocket integration
- **UI Components**: Radix UI primitives with custom styling
- **Build Tool**: Create React App
- **Linting**: ESLint with Airbnb configuration

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pokemon-battle-royale
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## 🎮 How to Use

1. **Join a Battle**: The application automatically loads a random Pokémon battle
2. **Select Your Champion**: Click on a Pokémon card to select it
3. **Cast Your Vote**: Click the "Vote" button to submit your choice
4. **Watch Live Results**: See real-time voting statistics and results
5. **Start New Battle**: Click "Start New Battle" to begin a new round

## 🧪 Testing

Run the test suite:
```bash
npm test
```

The application includes:
- Unit tests for core functionality
- Component testing with React Testing Library

## 🚀 Deployment

Build the production version:
```bash
npm run build
```

The build output will be in the `build/` directory, ready for deployment to any static hosting service.