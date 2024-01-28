# Explanatations

This is an API server for reading csv data of 3rd pparty APIs. Since it has mostly read requests I decide to go with mongodb.
Also used redis as cache for some endpoints.
## Technology used:
* Node.js
* Mongoose.js
* Redis.js
* Axios
* Mocha
* Chai
* ES6
* Docker

## How to setup?
In MongoDb image, there should be data to be tested for both test and development databases.


*  Clone the repository on your local machine
*  Run `npm install` to install all node dependencies.
*  Run `docker-compose up` in a terminal to have mongodb and redis in environment.
*  Run `npm run fetch:development` to populate development db.
*  Run `npm run fetch:test` to populate test db.
*  Run `docker-compose up` in a terminal to have mongodb and redis in environment.
*  Run `npm run serve:development` in another terminal session.
* `http://127.0.0.1:3030` is ready.

## Enpoints
I decided to create :
* `/fixtures` -> return all fixtures
* `/fixtures?limit=5&page=1` -> return first 5 records of first page of all fixtures
* `/bundesliga?limit=10&page=1` -> return first 10 records of first page of all bunesliga seasons
* `/prem?limit=10&page=1` -> return first 10 records of first page of all premier league seasons
* (Cached endpoints)
* `/bundesliga/limit=10&page=1&season=1718` -> returns first 10 records of first page of 17-18 season of bundesliga
* `/prem/limit=10&page=1&season=1819` -> returns first 10 records of first page of 18-19 season of premier league

## How to test?
* After you ready your databases, (after `docker-compose up & npm run fetch:test` commands)
* Run `npm run serve:test` in a terminal session.
* Open another terminal session and run `npm run test` to see test results.

## Test Results
```
  Test results for GET requests.
    ✔ should return a list of all fixtures. (88ms)
    ✔ should return limited list of fixtures page 1 limit 5.
    ✔ should return 5 fixtures from Bundesliga in page 2
    ✔ should return 6 fixtures from Premier League
    ✔ should return 15 fixtures from Bundesliga in 2018-2019
    ✔ should return 8 fixtures from Premier League in 2017-2018


  6 passing (132ms)
```

## Cache Logic
I used redis to cache responses. I cached the enpoint that lists fixtures according to season,limit and page. Used page,cache and season data to create

_ seperated keys. If the endpoint response not in the cache, store the response with the valid key and return the response from database. If there is data in cache, then return the data in the cache.

I try to achieve uniqueness for keys.

## Future Developments:
A solid GitHub actions and Docker file can be served. These are challenged me the most in terms of time and effort, other than that I delievered everything I assume. 

Since the business logice heavily depends on read operations, GraphQL can be a good choice for document based databases. Also I try to emulate CLI command as a cron write job, 

it may be configured with a message queue to consume and write more data with lesser latency and higher loads of data. 
I used redis but only for 2 endpoints, if it is done to all endpoints it may increase performance significantly since the applicaiton depends heavily on read operations.

