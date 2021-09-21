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

describe("/api:", () => {
  test("200: Return endpoint JSON", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(endpoints);
      });
  });
});
