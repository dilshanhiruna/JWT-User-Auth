const chai = require("chai");
const chaiHttp = require("chai-http");
const supertest = require("supertest");

chai.should();
chai.use(chaiHttp);

const server = require("../../server");

describe("User API", () => {
  describe("POST /register", () => {
    it("should return created user profile", (done) => {
      let body = {
        fullname: "test",
        email: "test@test.com",
        username: "test",
        password: "test",
      };
      request
        .request(server)
        .post("/api/user/register")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("fullname");
          res.body.should.have.property("email");
          res.body.should.have.property("username");
          done();
        });
    });
  });
  describe("POST /profile", () => {
    it("should return user profile", (done) => {
      var user = JSON.stringify({
        id: "61ea4c9b1337b377cc8ada8e",
      });

      request
        .request(server)
        .post("/api/user/profile")
        .send(user)
        .set(
          "x-auth-token",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZWE0YzliMTMzN2IzNzdjYzhhZGE4ZSIsImlhdCI6MTY0Mjc2Mzk5MCwiZXhwIjoxNjQyNzcxMTkwfQ.pxi29MDpK4s3ShnbLSOhu384qmS-wGTSytN6_pcLWQs"
        )
        .set("content-type", "application/json")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("fullname");
          res.body.should.have.property("email");
          res.body.should.have.property("username");
          done();
        });
    });
  });
});
