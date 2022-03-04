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
      testTopics = [
        {
          topic_id: 1,
          slug: "mitch",
          description: "The man, the Mitch, the legend",
        },
        {
          topic_id: 2,
          slug: "cats",
          description: "Not dogs",
        },
        {
          topic_id: 3,
          slug: "paper",
          description: "what books are made of",
        },
      ];

      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(expect.any(Object));
          expect(response.body.topics).toEqual(expect.any(Array));
          expect(response.body.topics.length).toEqual(testTopics.length);
          response.body.topics.forEach((topic) => {
            expect(topic).toMatchObject({
              topic_id: expect.any(Number),
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
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
          expect(response.body.article).toEqual(expect.any(Object));
        });
    });
    test("200: Returns the correct article", () => {
      const testArticle = {
        article: {
          author: "icellusedkars",
          title: "Sony Vaio; or, The Laptop",
          article_id: 2,
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          topic: "mitch",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
          totalcomments: "0",
        },
      };

      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(article.author).toBe("icellusedkars");
          expect(response.body.article.title).toBe("Sony Vaio; or, The Laptop");
          expect(article.article_id).toBe(2);
          expect(article.body).toBe(
            "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me."
          );
          expect(article.topic).toBe("mitch");
          expect(article.created_at).toBe("2020-10-16T05:03:00.000Z");
          expect(article.votes).toBe(0);
          expect(article.totalcomments).toBe(0);
        });
    });

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
    test("404: Response with status 404 if parametric value doesn't exist in the database", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Article Not Found" });
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
          const { article } = response.body;
          expect(response.body.hasOwnProperty("article")).toBe(true);
          expect(article.article_id).toBe(1);
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.body).toBe("I find this existence challenging");
          expect(article.votes).toBe(105);
          expect(article.topic).toBe("mitch");
          expect(article.author).toBe("butter_bridge");
          expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
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
    test("404: Responds with status 404 if the parametric value can't be found in the database", () => {
      return request(app)
        .patch("/api/articles/9999")
        .send({ inc_votes: 5 })
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Article Not Found" });
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("200: Returns an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toEqual(expect.any(Array));
          expect(articles.length).toBeGreaterThan(0);
          articles.forEach((article) => {
            expect(article.author).toEqual(expect.any(String));
            expect(article.author).toEqual(expect.any(String));
            expect(article.article_id).toEqual(expect.any(Number));
            expect(article.body).toEqual(expect.any(String));
            expect(article.topic).toEqual(expect.any(String));
            expect(article.created_at).toEqual(expect.any(String));
            expect(article.votes).toEqual(expect.any(Number));
            expect(article.totalcomments).toEqual(expect.any(Number));
          });
        });
    });
    test("200: Topic query param will filter articles array", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then((response) => {
          expect(
            response.body.articles.every((article) => (article.topic = "cats"))
          );
        });
    });
    test("200: Sort_by query param will reorder results", () => {
      return (
        request(app)
          .get("/api/articles?sort_by=title")
          // default sort order is DESC
          .expect(200)
          .then((response) => {
            const articles = response.body.articles;
            const lastIdx = articles.length - 1;
            expect(articles[0].title).toBe("Z");
            expect(articles[lastIdx].title).toBe("A");
          })
      );
    });
    test("200: Order query param will reorder results", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=ASC")
        .expect(200)
        .then((response) => {
          const articles = response.body.articles;
          const lastIdx = articles.length - 1;
          expect(articles[0].title).toBe("A");
          expect(articles[lastIdx].title).toBe("Z");
        });
    });
    test("200: Endpoint will return valid results if topic, sort_by and order are all provided", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=author&order=asc")
        .expect(200)
        .then((response) => {
          const articles = response.body.articles;
          const lastIdx = articles.length - 1;
          expect(articles[0].author).toBe("butter_bridge");
          expect(articles[0].article_id).toBe(1);
          expect(articles[lastIdx].article_id).toBe(10);
          expect(articles[lastIdx].author).toBe("rogersop");
        });
    });
    test("400: Endpoint responds with 'Invalid topic' if it can't be found in the topics table", () => {
      return request(app)
        .get("/api/articles?topic=hamsters")
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Invalid topic" });
        });
    });
    test("400: Endpoint responds with 'Invalid sort' if the field doesn't exist in the topics table", () => {
      return request(app)
        .get("/api/articles?sort_by=thisFieldDoesntExist")
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Invalid sort" });
        });
    });
    test("400: Endpoint responds with 'Invalid sort order' if the value isn't 'DESC' or 'ASC'", () => {
      return request(app)
        .get("/api/articles?order=disc")
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Invalid sort order" });
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("200: Returns an array of comments for the parametric article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toEqual(expect.any(Array));
        });
    });
    test("200: Comments array is in the correct format", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const r = response.body.comments[0];
          expect(r.comment_id).toEqual(expect.any(Number));
          expect(r.votes).toEqual(expect.any(Number));
          expect(r.created_at).toEqual(expect.any(String));
          expect(r.author).toEqual(expect.any(String));
          expect(r.body).toEqual(expect.any(String));
        });
    });
    test("200: Responds with an empty array if the article has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toEqual(expect.any(Array));
          expect(response.body.comments.length).toBe(0);
        });
    });
    test("400: Responds with status 400 if the parametric value is not a valid integer", () => {
      return request(app)
        .get("/api/articles/apple/comments")
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Bad Request" });
        });
    });
  });
  describe("POST", () => {
    test("201: Adds new comment to the database and returns comment details", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "lurker", body: "awesome article!" })
        .expect(201)
        .then((response) => {
          expect(response.body.comment).toEqual(expect.any(Array));
        });
    });
    test("400: Reject invalid article_id", () => {
      return request(app)
        .post("/api/articles/sausage/comments")
        .send({ username: "lurker", body: "no-one will ever know" })
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Bad Request" });
        });
    });
    test("400: Reject invalid request.body JSON", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "lurker", comment: "bad key" })
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Bad Request" });
        });
    });
    test("400: Reject if username doesn't exist", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "doesNotExist", body: "TBD" })
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Bad User Id" });
        });
    });
  });
  describe("DELETE", () => {
    test("202: Returns the deleted comment as a property of ", () => {});
    test("202: Returns a status code of 200 if the comment was successfully removed", () => {
      return request(app)
        .delete("/api/articles/1/comments/2")
        .expect(202)
        .then((response) => {
          expect(response.body).toEqual({
            removedComment: [
              {
                comment_id: 2,
                author: 1,
                article_id: 1,
                votes: 14,
                created_at: "2020-10-31T03:03:00.000Z",
                body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
              },
            ],
          });
        });
    });
    test("404: Returns a status code of 404 if the Article Id is not specified", () => {
      return request(app)
        .delete("/api/articles//comments/2")
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Invalid URL" });
        });
    });
    test("404: Returns a status code of 404 if the Comment Id is not specified", () => {
      return request(app)
        .delete("/api/articles/1/comments/")
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Invalid URL" });
        });
    });
    test("400: Returns a status code of 400 if the Article Id can't be found in the database", () => {
      return request(app)
        .delete("/api/articles/300/comments/2")
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Article Not Found" });
        });
    });
    test("400: Returns a status code of 400 if the Comment Id can't be found in the database", () => {
      return request(app)
        .delete("/api/articles/1/comments/300")
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Comment Not Found" });
        });
    });
  });
});
