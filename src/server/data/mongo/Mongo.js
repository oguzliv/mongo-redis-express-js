import Mongoose from "mongoose";
import "dotenv/config";
import Fixture from "../Fixture.js";
import ServerConfig from "../../config/ServerConfig.js";
import bluebird from "bluebird";

export default class Mongo {
  constructor(app) {
    this.app = app;
    this.connectMongo();
  }

  connectMongo() {
    Mongoose.Promise = bluebird;
    Mongoose.connect(ServerConfig.MONGO_DB_URL + ServerConfig.MONGO_DB);

    Mongoose.connection.on(
      "error",
      console.error.bind(console, "Connection error occured!")
    );

    Mongoose.connection.once("open", () => {
      console.log("Mongo connection is successfull.");
      this.loadModels();
    });
  }
  /**
   * Load models here by creating and instance from their classes.
   */
  loadModels() {
    const fixture = new Fixture(Mongoose);
    console.log("Mongo models are loaded.");
  }

  getMongoose() {
    return Mongoose;
  }
}
