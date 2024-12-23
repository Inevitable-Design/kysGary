import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxLength: 1000,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userAddress: {
    type: String,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
});

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

// models/Game.ts
const gameSchema = new mongoose.Schema({
  prizePool: {
    type: Number,
    required: true,
    default: 300,
  },
  messageCount: {
    type: Number,
    default: 0,
  },
  lastMessageTime: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  currentFee: {
    type: Number,
    default: 1,
  },
});

const Game = mongoose.models.Game || mongoose.model("Game", gameSchema);

// models/User.ts
const userSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  nonce: {
    type: String,
    required: true,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export { Message, Game, User };
