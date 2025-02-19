import redis from "redis"
import dotenv from "dotenv"

dotenv.config();

const redisClient = redis.createClient({
    // socket: {
    //     host: process.env.REDIS_HOST,
    //     port: process.env.REDIS_PORT,
    // },
    // database: process.env.REDIS_DB
    url: process.env.REDIS_HOST
});

(async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis on port: 6379");
    } catch (err) {
        console.error("Redis Connection Error:", err);
    }
})();

redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});

export default redisClient