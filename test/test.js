import Chai from "chai";
import ChaiClient from "chai-http";
import ServerConfig from "../src/server/config/ServerConfig.js";

const Expect = Chai.expect;
Chai.use(ChaiClient);

describe("Test results for GET requests.", () => {
  it("should return a list of all fixtures.", (done) => {
    Chai.request(ServerConfig.SERVER_TEST)
      .get("/fixtures")
      .end((err, res) => {
        Expect(err).to.be.null;
        Expect(res).to.have.status(200);
        Expect(res).to.be.json;
        Expect(res).not.to.be.empty;
        Expect(res.body).to.be.lengthOf.above(0);
        done();
      });
  });

  it("should return limited list of fixtures page 1 limit 5.", (done) => {
    Chai.request(ServerConfig.SERVER_TEST)
      .get("/fixtures/list")
      .query({ page: 1, limit: 5 })
      .end((err, res) => {
        Expect(err).to.be.null;
        Expect(res).to.have.status(200);
        Expect(res).to.be.json;
        Expect(res).not.to.be.empty;
        Expect(res.body).to.have.lengthOf.within(0, 5);
        done();
      });
  });

  it("should return 5 fixtures from Bundesliga in page 2", (done) => {
    Chai.request(ServerConfig.SERVER_TEST)
      .get("/bundesliga")
      .query({ page: 1, limit: 5 })
      .end((err, res) => {
        Expect(err).to.be.null;
        Expect(res).to.have.status(200);
        Expect(res).to.be.json;
        Expect(res).not.to.be.empty;
        Expect(res.body[0].div).to.be.equals("D1");
        Expect(res.body).to.have.lengthOf.within(0, 5);
        done();
      });
  });

  it("should return 6 fixtures from Premier League", (done) => {
    Chai.request(ServerConfig.SERVER_TEST)
      .get("/prem")
      .query({ page: 3, limit: 6, season: 1819 })
      .end((err, res) => {
        Expect(err).to.be.null;
        Expect(res).to.have.status(200);
        Expect(res).to.be.json;
        Expect(res).not.to.be.empty;
        Expect(res.body).to.have.lengthOf.within(0, 6);
        Expect(res.body[0].div).to.be.equals("E0");
        done();
      });
  });

  it("should return 15 fixtures from Bundesliga in 2018-2019", (done) => {
    Chai.request(ServerConfig.SERVER_TEST)
      .get("/bundesliga/seasons")
      .query({ page: 1, limit: 15, season: 1819 })
      .end((err, res) => {
        Expect(err).to.be.null;
        Expect(res).to.have.status(200);
        Expect(res).to.be.json;
        Expect(res).not.to.be.empty;
        Expect(res.body).to.have.lengthOf.within(0, 15);
        Expect(res.body[0].season).to.be.equals(1819);
        Expect(res.body[0].div).to.be.equals("D1");
        done();
      });
  });

  it("should return 8 fixtures from Premier League in 2017-2018", (done) => {
    Chai.request(ServerConfig.SERVER_TEST)
      .get("/prem/seasons")
      .query({ page: 1, limit: 8, season: 1718 })
      .end((err, res) => {
        Expect(err).to.be.null;
        Expect(res).to.have.status(200);
        Expect(res).to.be.json;
        Expect(res).not.to.be.empty;
        Expect(res.body).to.have.lengthOf.within(0, 8);
        Expect(res.body[0].season).to.be.equals(1718);
        Expect(res.body[0].div).to.be.equals("E0");
        done();
      });
  });
});
