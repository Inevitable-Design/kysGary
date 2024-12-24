# 🎮 Kill Yourself gary - Hackathon Submission

## Project Overview
A decentralized social game built on Solana where players engage in strategic message-based gameplay within 24-hour time windows. The game combines blockchain technology, social interaction, and game theory to create an engaging competitive experience.

## Technical Architecture 

### Core Technology Stack
- **Blockchain**: Solana
- **Frontend**: Next.js (React)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Custom Context
- **Wallet Integration**: Solana Wallet Adapter
- **Backend**: NextJS API Routes
- **Database**: MongoDB
- **Authentication**: JWT
- **API Integration**: Gary API for social interaction

### Key Components

#### Frontend Components

1. **HeroSection** (`components/hero.tsx`)
   - Wallet connection management
   - Prize pool display with live updates
   - Dynamic countdown timer
   - Theme switching functionality

2. **MessageBoard** (`components/messageBoard.tsx`)
   - Real-time message display
   - Message submission interface
   - Transaction status indicators
   - Message history with infinite scroll

3. **GameStats** (`components/gameStats.tsx`)
   - Current prize pool tracking
   - Active player count
   - Time remaining display
   - Message fee calculator

### Game Mechanics

#### Core Features
- 24-hour rolling time windows
- Dynamic fee structure (starting at $1, capped at $200)
- Automated prize pool distribution
- Message verification and validation
- Historical context maintenance (50k+ tokens)

#### Prize Pool Management
- Initial pool: $300
- Distribution: 75% to prize pool, 25% to treasury
- Exponential growth until fee cap
- Linear growth after fee cap

### API Endpoints

#### Game State
```typescript
// GET /api/game/state
interface GameState {
  prizePool: number;
  lastMessageTime: number;
  messageCount: number;
  currentFee: number;
  timeRemaining: number;
}
```

#### Message Submission
```typescript
// POST /api/game/message
interface SubmitMessage {
  message: string;
  signature: string;
  timestamp: number;
  walletAddress: string;
}
```

#### User Authentication
```typescript
// POST /api/auth/login
interface AuthRequest {
  walletAddress: string;
  signature: string;
}
```

### Database Schema

#### Messages Collection
```typescript
interface Message {
  _id: ObjectId;
  content: string;
  walletAddress: string;
  timestamp: Date;
  gameId: string;
  fee: number;
}
```

#### Games Collection
```typescript
interface Game {
  _id: ObjectId;
  startTime: Date;
  prizePool: number;
  status: 'active' | 'completed' | 'timedOut';
  messageCount: number;
  lastMessageTime: Date;
}
```

## Development Setup

### Prerequisites
- Node.js 16+
- MongoDB
- Solana CLI tools

### Installation
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
```env
# MongoDB connection string
MONGODB_URI=mongodb://...

# Solana RPC endpoints
SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Wallet configuration
TREASURY_WALLET=your_treasury_wallet_private_key
NEXT_PUBLIC_TREASURY_WALLET_PUBKEY=your_treasury_wallet_public_key

# Authentication
JWT_SECRET=your_jwt_secret_key

# External APIs
GARY_API_URL=https://api.gary.example.com
```

## API Integration

### Gary API Integration
```typescript
const handleMessage = async (message: string) => {
  const response = await fetch(process.env.GARY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      context: lastMessages,
    }),
  });
  
  return response.json();
};
```

## Game Flow

1. **User Connection**
   - Connect Solana wallet
   - Verify wallet balance
   - Generate JWT token

2. **Message Submission**
   - Calculate current fee
   - Verify sufficient balance
   - Process transaction
   - Store message in MongoDB
   - Update game state

3. **Prize Distribution**
   - Monitor game conditions
   - Validate winning conditions
   - Process prize transfer
   - Update game status

## Security Measures

### Transaction Security
- Double-submission prevention
- Rate limiting per wallet
- Input sanitization
- Signature verification

### API Security
- JWT authentication
- Rate limiting
- CORS configuration
- Request validation

## Future Enhancements

### Technical Roadmap
1. WebSocket integration for real-time updates
2. Enhanced analytics dashboard
3. Mobile-responsive design improvements
4. Performance optimization for high-load scenarios

### Gameplay Evolution
1. Multiple concurrent games
2. Social features (user profiles, chat)
3. Achievement system
4. Historical leaderboards

## License
MIT License