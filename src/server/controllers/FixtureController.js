import ServerConfig from "../config/ServerConfig.js";

export default class FixtureController {
  // List all users.
  static async getFixtures(req, res, next, db) {
    const data = await db.models.Fixture.find().sort({ _id: 1 });
    res.send(data);
  }
  //List paged result for all fixtures
  static async getPagedFixtures(req, res, next, db) {
    const { page, limit } = req.query;

    if (page < 0) {
      const data = await FixtureController.getFixtures(req, res, next, db);
      res.send(data);
    } else {
      const data = await db.models.Fixture.find()
        .skip(limit * page)
        .limit(limit)
        .sort({ _id: 1 });
      res.send(data);
    }
  }

  //List bundesliga fixtures
  static async getBundesliga(req, res, next, db) {
    const { page, limit, season } = req.query;

    if (req.query.page < 0) {
      const data = await db.models.Fixture.find({
        div: "D1",
      }).sort({ _id: 1 });
      res.send(data);
    } else {
      const data = await db.models.Fixture.find({
        div: "D1",
      })
        .skip(limit * page)
        .limit(limit)
        .sort({ _id: 1 });
      res.send(data);
    }
  }

  static async getBundesligaSeason(req, res, next, db, redisMiddleware) {
    const { page, limit, season } = req.query;
    if (req.query.page < 0) {
      const data = await db.models.Fixture.find({
        div: "D1",
        season: season,
      }).sort({ _id: 1 });
      res.send(data);
    } else {
      const data = await db.models.Fixture.find({
        div: "D1",
        season: season,
      })
        .skip(limit * page)
        .limit(limit)
        .sort({ _id: 1 });
      const key = redisMiddleware.generateCacheKey(
        req.path,
        req.query.season,
        req.query.page,
        req.query.limit
      );
      redisMiddleware.redisClient.set(key, JSON.stringify(data));

      await redisMiddleware.redisClient.expire(
        key,
        ServerConfig.REDIS_CACHE_TIMEOUT
      );
      console.log(`Response is cached with key: ${key}`);

      res.send(data);
    }
  }

  //List Premier League fixtures
  static async getPremierLeague(req, res, next, db) {
    const { page, limit } = req.query;
    if (req.query.page < 0) {
      const data = await db.models.Fixture.find({
        div: "E0",
      }).sort({ _id: 1 });
      res.send(data);
    } else {
      const data = await db.models.Fixture.find({
        div: "E0",
      })
        .skip(limit * page)
        .limit(limit)
        .sort({ _id: 1 });
      res.send(data);
    }
  }

  static async getPremierLeagueSeason(req, res, next, db, redisMiddleware) {
    const { page, limit, season } = req.query;

    if (req.query.page < 0) {
      const data = await db.models.Fixture.find({
        div: "E0",
        season: season,
      }).sort({ _id: 1 });
      res.send(data);
    } else {
      const data = await db.models.Fixture.find({
        div: "E0",
        season: season,
      })
        .skip(limit * page)
        .limit(limit)
        .sort({ _id: 1 });

      // await redisMiddleware.redisClient.connect();
      const key = redisMiddleware.generateCacheKey(
        req.path,
        req.query.season,
        req.query.page,
        req.query.limit
      );
      redisMiddleware.redisClient.set(key, JSON.stringify(data));
      await redisMiddleware.redisClient.expire(
        key,
        ServerConfig.REDIS_CACHE_TIMEOUT
      );
      console.log(`Response is cached with key: ${key}`);

      res.send(data);
    }
  }
}
