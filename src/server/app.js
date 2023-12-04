import Express from "express";
import ServerConfig from "./config/ServerConfig.js";
import Mongo from "./data/mongo/Mongo.js";
import Cache from "./data/redis/Cache.js";
import CommonMiddleware from "./middlewares/CommonMiddleware.js";
import CacheMiddleware from "./middlewares/CacheMiddleware.js";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import Routes from "./routes/Routes.js";

const app = Express();

const commonMiddleware = new CommonMiddleware(app);

const errorHandler = new ErrorHandler(app);

const db = new Mongo(app);

const redis = new Cache(app);

const redisMiddleware = new CacheMiddleware(app, redis.client);

const routes = new Routes(
  Express,
  app,
  commonMiddleware,
  redisMiddleware,
  db.getMongoose()
);

const server = app.listen(
  ServerConfig.SERVER_PORT,
  ServerConfig.SERVER_HOST,
  () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Server ENV is ${process.env.NODE_ENV}`);
    console.log(`Server is listening at http://${host}:${port}`);
  }
);
