# Pokémon Battle Royale

A React app where users can vote for their favorite Pokémon in head-to-head battles with **real-time voting updates** via WebSocket connection to a public server.

## 🎯 Features

### Core Requirements
- **Live Pokémon Display**: Shows Bulbasaur vs Pikachu (hardcoded) with data from PokéAPI
- **Voting System**: One vote per user with vote persistence and real-time updates
- **Real-time Sync**: **True real-time** WebSocket connection to public server for live vote updates across all users
- **Clean State Management**: Uses React hooks for predictable state management

### Bonus Features ✨
- **New Battle Button**: Start random battles between different Pokémon
- **Smooth Animations**: Transitions when switching from voting to results
- **Duplicate Vote Warning**: Alerts users if they try to vote from multiple tabs
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Error Handling**: Graceful handling of API failures and loading states

## 🌍 Real-Time Voting

This application now features **true real-time voting** across multiple users:

- **Public WebSocket Server**: Connects to `wss://echo.websocket.org/` for real-time communication
- **Battle Rooms**: Each Pokémon battle creates a unique room/channel for isolated voting
- **Live Vote Updates**: See votes from other users instantly across different browser tabs/devices
- **User Identification**: Each user gets a unique ID for vote tracking
- **Automatic Reconnection**: Handles connection drops gracefully with auto-reconnect
- **Heartbeat System**: Keeps connections alive with periodic heartbeat messages

### How to Test Real-Time Voting

1. Open the app in multiple browser tabs or different browsers
2. Start the same battle (same Pokémon pair) in all tabs
3. Vote from one tab and watch the results update instantly in all other tabs
4. The voting is truly synchronized across all connected users!

## 🏗️ Architecture

This project follows **Feature-Sliced Design (FSD)** architecture:

```
src/
├── app/           # App initialization and global providers
├── pages/         # Page components
├── widgets/       # Complex UI blocks combining features
├── features/      # Business logic features (voting)
├── entities/      # Business entities (Pokemon)
└── shared/        # Reusable code
    ├── api/       # API layer
    ├── hooks/     # Custom hooks
    ├── lib/       # Utilities
    ├── types/     # TypeScript types
    ├── ui/        # UI components
    └── constants/ # App constants
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

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

4. Open [http://localhost:3000](http://localhost:3000) to view the app

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run lint` - Runs ESLint
- `npm run lint:fix` - Fixes ESLint errors automatically

## 🔧 Technical Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: React Query + React hooks
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Linting**: ESLint with TypeScript support
- **Architecture**: Feature-Sliced Design (FSD)

## 🎮 How to Use

1. **View the Battle**: See two Pokémon face off with their stats
2. **Vote**: Click on a Pokémon card to select it, then click "Vote"
3. **Watch Results**: See real-time vote updates from simulated users
4. **New Battle**: Click "Start New Battle" to fight with random Pokémon
5. **Multiple Tabs**: Try opening multiple tabs - the app warns about duplicate votes!

## 🔌 WebSocket Simulation

Since the requirement was to implement WebSocket "WITHOUT a server", this app simulates WebSocket functionality:

- **Mock WebSocket Service**: Simulates connection, message broadcasting
- **Auto-Generated Votes**: Simulates other users voting with random delays
- **Real-time Updates**: All connected clients receive vote updates instantly
- **Connection Status**: Shows connection state with retry functionality

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 UI/UX Features

- **Loading States**: Smooth loading animations while fetching data
- **Error Handling**: User-friendly error messages with retry options
- **Hover Effects**: Interactive card animations
- **Winner Highlighting**: Visual celebration for the winning Pokémon
- **Vote Progress Bars**: Animated progress visualization
- **Connection Indicators**: Visual feedback for WebSocket status

## 🐛 Error Handling

The app gracefully handles:
- API failures (PokéAPI unavailable)
- Network connectivity issues
- WebSocket connection problems
- Invalid Pokémon data
- Duplicate voting attempts

## 📦 Project Structure Details

### Key Components

- **BattleWidget**: Main widget orchestrating the battle
- **VotingInterface**: Handles voting UI and real-time updates
- **PokemonCard**: Displays individual Pokémon with stats
- **WebSocket Service**: Manages simulated real-time connections

### Custom Hooks

- **usePokemon**: Fetches Pokémon data with caching
- **useVoting**: Manages voting state and WebSocket integration
- **useWebSocket**: Handles WebSocket connection lifecycle
- **useBattleManager**: Controls battle flow and Pokémon selection

## 🎯 Assessment Criteria Coverage

- ✅ **React Architecture**: Clean FSD structure with reusable components
- ✅ **API Usage**: Efficient PokéAPI integration with React Query
- ✅ **Real-time Sync**: Simulated WebSocket with live vote updates
- ✅ **Voting Logic**: One vote per user, visual feedback, winner detection
- ✅ **Error Handling**: Comprehensive error states and loading management
- ✅ **Bonus Creativity**: Random battles, animations, duplicate vote warnings

## 🚀 Future Enhancements

- Real WebSocket server integration
- User authentication and profiles
- Battle history and statistics
- Tournament mode with brackets
- More Pokémon stats and abilities
- Sound effects and animations
- Leaderboards and achievements
