export default class CacheMiddleware {
  constructor(app, redis) {
    this.app = app;
    this.redisClient = redis;
  }

  async cacheCheck(req, res, next, self) {
    const key = this.generateCacheKey(
      req.path,
      req.query.season,
      req.query.page,
      req.query.limit
    );
    await self.redisClient.connect();
    try {
      const data = await self.redisClient.get(key);
      if (data != null) {
        // Send cached data.
        console.log(`Response is sent from cache with key: ${key}`);
        res.status(200).send(JSON.parse(data));
      } else {
        // If there is no cached data then let leave the caching to the
        // final controller function.
        console.log(`Response is not sent from cache with key: ${key}`);
        next();
      }
    } catch (err) {
      throw err;
    }
    await self.redisClient.disconnect();
  }

  generateCacheKey(path, season, page, limit) {
    return `${path}_${season}_${page}_${limit}`;
  }
}
