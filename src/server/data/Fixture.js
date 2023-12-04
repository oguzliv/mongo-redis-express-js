export default class Fixture {
  constructor(mongoose) {
    this.mongoose = mongoose;
    this.createModel();
  }

  createModel() {
    const Schema = this.mongoose.Schema;
    this.mongoose.model(
      "Fixture",
      new Schema({
        date: Date,
        away_team: String,
        home_team: String,
        refree: String,
        fthg: Number,
        ftag: Number,
        div: String,
        season: Number,
      })
    );
  }
}
