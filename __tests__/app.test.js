const db = require("../db/connection.js");
const app = require("../app.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const endpoints = require("../endpoints.json");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Invalid URL", () => {
  test("404: Reject requests made to invalid endpoints", () => {
    return request(app).get("/thisIsntTheEndpointYoureLookingFor").expect(404);
  });
});

describe("/api", () => {
  describe("GET", () => {
    test("200: Returns endpoint JSON", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(endpoints);
        });
    });
  });
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("200: Returns an object with a key of topics containing an array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(expect.any(Object));
          expect(response.body.topics).toEqual(expect.any(Array));
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("200: Returns an object with a key of article containing an object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(expect.any(Object));
        });
    });
    test("200: Article.article_id matches the supplied parametric value", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((response) => {
          expect(response.body.article.article_id).toBe(2);
        });
    });
    // test("404: Responds with status 404 if no parametric value is provided", () => {
    //   return request(app)
    //     .get("/api/articles/")
    //     .expect(404)
    //     .then((response) => {
    //       expect(response.body).toEqual({ msg: "Invalid URL" });
    //     });
    // });
    test("400: Responds with status 400 if the parametric value is not a valid integer", () => {
      return request(app)
        .get("/api/articles/sandwich")
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Bad Request" });
        });
    });
    test("400: Responds with status 400 if the parametric value is less than 1", () => {
      return request(app)
        .get("/api/articles/-3")
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Bad Request" });
        });
    });
  });
  describe("PATCH", () => {
    test("200: Increments article votes as expected, returning an object containing the updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 5 })
        .expect(200)
        .then((response) => {
          expect(response.body.hasOwnProperty("article")).toBe(true);
          expect(response.body.article.votes).toBe(105);
        });
    });
    test("200: Repeated calls will continue to increment vote count as expected", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: 10 })
        .expect(200)
        .then((response) => {
          return request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: 10 })
            .expect(200)
            .then((response) => {
              expect(response.body.article.votes).toBe(20);
            });
        });
    });
    test("200: Negative numbers will decrement vote count as expected", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -40 })
        .expect(200)
        .then((response) => {
          expect(response.body.article.votes).toBe(60);
        });
    });
    test("200: Endpoint won't decrease vote count lower than a floor of 0", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -120 })
        .expect(200)
        .then((response) => {
          expect(response.body.article.votes).toBe(0);
        });
    });
    test("400: Responds with status 400 if the parametric value is not a valid integer", () => {
      return request(app)
        .patch("/api/articles/apple")
        .send({ inc_votes: 20 })
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Bad Request" });
        });
    });
    test("400: Responds with status 400 if the votes adjustment is not a valid integer", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "banana" })
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Bad Request" });
        });
    });
  });
});

describe("api/articles", () => {
  describe("GET", () => {
    test("200: Returns an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toEqual(expect.any(Array));
        });
    });
  });
});
