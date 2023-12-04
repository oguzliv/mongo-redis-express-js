import Redis from "redis";
import ServerConfig from "../../config/ServerConfig.js";

export default class Cache {
  constructor(app) {
    this.app = app;
    this.client = Redis.createClient({
      host: ServerConfig.REDIS_HOST,
      port: ServerConfig.REDIS_PORT,
    });

    console.log(
      `Redis connection is successfull. Cache timeout is ${ServerConfig.REDIS_CACHE_TIMEOUT} seconds`
    );
  }
}
