import FixtureController from "../controllers/FixtureController.js";

export default class Routes {
  constructor(express, app, commonMiddleware, redisCacheMiddleware, db) {
    this.express = express;
    this.app = app;
    this.commonMiddleware = commonMiddleware;
    this.redisCacheMiddleware = redisCacheMiddleware;
    this.db = db;
    this.createURLRoutes();
  }

  createURLRoutes() {
    // ::::GETs::::
    //List all fixtures
    this.app.get("/fixtures", (req, res, next) => {
      FixtureController.getPagedFixtures(req, res, next, this.db);
    });

    //List pagineted result for all fixtures
    this.app.get(
      "/fixtures/list",
      this.commonMiddleware.queryPageLimitCheck,
      (req, res, next) => {
        FixtureController.getPagedFixtures(req, res, next, this.db);
      }
    );

    // Bundesliga
    //Paginated Bundesliga results
    this.app.get(
      "/bundesliga",
      this.commonMiddleware.queryPageLimitCheck,
      (req, res, next) => {
        FixtureController.getBundesliga(req, res, next, this.db);
      }
    );

    //Paginated bundesliga fixtures for a specific season
    //Also cached
    this.app.get(
      "/bundesliga/seasons",
      this.commonMiddleware.querySeasonCheck,
      this.commonMiddleware.queryPageLimitCheck,
      (req, res, next) => {
        this.redisCacheMiddleware.cacheCheck(
          req,
          res,
          next,
          this.redisCacheMiddleware
        );
      },
      (req, res, next) => {
        FixtureController.getBundesligaSeason(
          req,
          res,
          next,
          this.db,
          this.redisCacheMiddleware
        );
      }
    );

    //Paginated premier league fixtures
    this.app.get(
      "/prem",
      this.commonMiddleware.queryPageLimitCheck,
      (req, res, next) => {
        FixtureController.getPremierLeague(req, res, next, this.db);
      }
    );

    //paginated premier league fixtures for a specific season
    this.app.get(
      "/prem/seasons",
      this.commonMiddleware.querySeasonCheck,
      this.commonMiddleware.queryPageLimitCheck,

      (req, res, next) => {
        this.redisCacheMiddleware.cacheCheck(
          req,
          res,
          next,
          this.redisCacheMiddleware
        );
      },
      (req, res, next) => {
        FixtureController.getPremierLeagueSeason(
          req,
          res,
          next,
          this.db,
          this.redisCacheMiddleware
        );
      }
    );

    // List users by /users/list?age=32&limit=3&page=0
    // this.app.get(
    //   "/users/list",
    //   this.commonMiddleware.queryLimitPageCheck,
    //   (req, res, next) => {
    //     this.redisCacheMiddleware.cacheCheck(
    //       req,
    //       res,
    //       next,
    //       this.redisCacheMiddleware
    //     );
    //   },
    //   (req, res, next) => {
    //     UserController.readUsersByPage(
    //       req,
    //       res,
    //       next,
    //       this.db,
    //       this.redisCacheMiddleware
    //     );
    //   }
    // );

    // List all fixtures
    // this.app.get("/fixtures", (req, res, next) => {
    //   FixtureController.getFixtures(req, res, next, this.db);
    // });

    // List all fixtures with pagination

    // Get single user by /user?email
    // this.app.get(
    //   "/user",
    //   this.commonMiddleware.queryContainsEmail,
    //   (req, res, next) => {
    //     UserController.readUserByEmail(req, res, next, this.db);
    //   }
    // );
  }
}
