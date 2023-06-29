const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});
describe("GET /api/topics", () => {
  test("return 200 status, should return an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBeGreaterThan(0);
        expect(Array.isArray(body.topics)).toBe(true);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});
describe("GET /api", () => {
  test("return 200 status, should give an object describing endpoints ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endPointKeys = Object.keys(endpoints);
        endPointKeys.forEach((endPointKey) => {
          expect(body).toHaveProperty(endPointKey);
          expect(body[endPointKey]).toEqual(endpoints[endPointKey]);
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("return 200 status, should get an article by its id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
        expect(article.article_id).toBe(1);
      });
  });
});
describe("Error Handling 400/404", () => {
  test("return 404 status, should return an error when the article is not found", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Article not found");
      });
  });
  test("return 400 status, should return an error for not valid article id", () => {
    return request(app)
      .get("/api/articles/apples")
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Bad request");
      });
  });
});
describe("GET /api/articles", () => {
  test("return 200 status, will get all the articles in descending order with a comment count and no body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);

        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});
describe("Error Handling 404 ", () => {
  test("should return 404 error when passed the wrong endpoint", () => {
    return request(app)
      .get("/api/invalid")
      .expect(404)
      .then(({ body }) => {
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Not found");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("return 200 status, should get a comment by its article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBeGreaterThan(0)
        expect(comments).toBeSorted({descending: true})
        comments.forEach((comment) =>{
          expect(comment.article_id).toBe(1);
          expect(comment).toMatchObject({
           
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            
        })
    
        });
      });
  });

});
describe("Error Handling 400/404", () => {
  test("return 404 status, should return an error when the article is not found", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Article not found");
      });
  });
  test("return 400 status, should return an error for not valid article id", () => {
    return request(app)
      .get("/api/articles/no/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Bad request");
      });
  });
});
