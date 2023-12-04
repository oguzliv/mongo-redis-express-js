#!/usr/bin/env node

import axios from "axios";
import path from "path";
import csvParser from "csv-parser";

import Mongo from "../../data/mongo/Mongo.js";
import ServerConfig from "../../config/ServerConfig.js";

const urls = [
  "https://static.onedio.com/case-studies/1819-D1.csv",
  "https://static.onedio.com/case-studies/1718-D1.csv",
  "https://static.onedio.com/case-studies/1819-E0.csv",
  "https://static.onedio.com/case-studies/1718-E0.csv",
];

const db = new Mongo().getMongoose();

console.log(ServerConfig);

async function fetchData(url) {
  const result = [];
  if (path.extname(url) !== ".csv") {
    console.log("File extension is not .csv !!!");
    return;
  }

  //Helpers for date and season formatting
  const DateConverter = (dateStr) => {
    // Assuming the date string is in the format "DD/MM/YYYY"
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month, day); // Note: Months are 0-indexed in JavaScript dates
  };

  const SeasonConverter = (urlstr) => {
    const regex = /\/(\d+)-[A-Za-z]\d\.csv/;
    const match = url.match(regex);
    return parseInt(match[1], 10);
  };
  try {
    const { data } = await axios.get(url, { responseType: "stream" });

    await new Promise((resolve, reject) => {
      data
        .pipe(csvParser())
        .on("data", async (data) => {
          result.push({
            date: DateConverter(data.Date),
            away_team: data.AwayTeam,
            home_team: data.HomeTeam,
            referee: data.Referee,
            fthg: data.FTHG,
            ftag: data.FTAG,
            div: data.Div,
            season: SeasonConverter(data.Date),
          });
        })
        .on("end", async () => {
          // CSV parsing is complete
          resolve();
        })
        .on("error", (error) => {
          // Handle errors during CSV parsing
          reject(error);
        });
    });
  } catch (error) {
    // Handle errors during the Axios request
    console.error(`Error fetching data: ${error.message}`);
  }

  console.log(`${url} record : ${result.length}`);
  return result;
}
for (let url of urls) {
  const data = await fetchData(url);
  await db.models.Fixture.create(data);
}

// await db.models.Fixture.deleteMany({});
await db.disconnect();
