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
    test("200: Return endpoint JSON", () => {
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
  });
});
