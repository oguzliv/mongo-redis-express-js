import BodyParser from "body-parser";

export default class CommonMiddleware {
  constructor(app) {
    this.app = app;
    this.applyMiddlewares();
  }

  // Apply common and necessary appwise middlewares.
  applyMiddlewares() {
    this.app.use(BodyParser.json());
    this.app.use(BodyParser.urlencoded({ extended: true }));
  }

  queryPageLimitCheck(req, res, next) {
    if (
      req.query.limit &&
      req.query.page &&
      req.query.limit >= 0 &&
      req.query.page >= 0
    ) {
      req.query.page--;
      next();
    } else {
      res.status(400).send("This page and limit parameters are not valid.");
    }
  }
  querySeasonCheck(req, res, next) {
    if (
      req.query.season &&
      (req.query.season == 1718 || req.query.season == 1819)
    )
      next();
    else res.status(400).send("Season parameter is invalid.");
  }
}
