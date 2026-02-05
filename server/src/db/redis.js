import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const redisClient = createClient({
    url: url.startsWith('redis') ? url : `redis://${url}`, 
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                console.log("⚠️ Redis: Max retries reached. MongoDB fallback active.");
                return false; 
            }
            return 1000; 
        }
    }
});

redisClient.on('error', (err) => console.log('⚠️ Redis Client Error:', err.message));

export { redisClient };