import { CronJob } from 'cron';
import { Game, Message } from '../../../db/schema';
import { transferPrizePool } from '@/lib/solana';

const gameCheckJob = new CronJob('0 * * * *', async () => {
  const game = await Game.findOne({ isActive: true });
  if (!game || game.messageCount < 150) return;

  const lastMessage = await Message.findOne().sort({ timestamp: -1 });
  if (!lastMessage) return;

  const hoursSinceLastMessage = (Date.now() - lastMessage.timestamp) / (1000 * 60 * 60);
  
  if (hoursSinceLastMessage >= 24) {
    game.isActive = false;
    
    const lastUserShare = game.prizePool * 0.2;
    await transferPrizePool(lastMessage.userAddress, lastUserShare);
    
    const messages = await Message.find();
    const perMessageShare = (game.prizePool * 0.75) / messages.length;
    
    for (const msg of messages) {
      await transferPrizePool(msg.userAddress, perMessageShare);
    }
    
    await game.save();
  }
});

gameCheckJob.start();