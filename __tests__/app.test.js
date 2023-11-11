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
        expect(comments.length).toBeGreaterThan(0);
        expect(comments).toBeSorted({ descending: true });
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test(" should return 200 status  when no comments are found", () => {
    return request(app)
      .get("/api/articles/12/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments).toEqual([]);
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
describe("POST /api/articles/:article_id/comments", () => {
  test("return 201 status, will add a comment for an article ", () => {
    const comment = {
      body: "This is a comment.",
      username: "icellusedkars",
      article_id: 1,
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;

        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
});
describe("Error handling 400", () => {
  test("return 400 status, should return an error for not valid article id", () => {
    const comment = {
      body: "This is a comment.",
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Bad request");
      });
  });

  test("should return 400 error if wrong values are passed", () => {
    const wrongComment = {
      username: "",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(wrongComment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Bad request");
      });
  });

  test("should return 404 error if wrong username is passed", () => {
    const wrongComment = {
      username: "Simone",
      body: "This is a valid comment",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(wrongComment)
      .expect(404)
      .then(({ body }) => {
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("return 200 status, should change the votes of an article by its id", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const { votes } = body.articles;
        expect(votes).toBe(101);
      });
  });

  test("return 200 status, should decrement the votes of an article by its id", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body }) => {
      
        const { votes } = body.articles;

        expect(votes).toBe(95);
      });
  });
  describe("Error handling 400", () => {
    test("return 400 status, should handle invalid inc_votes value", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "invalid" })
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Bad request");
        });
    });

    test("return 404 status, should handle non-existing article_id", () => {
      return request(app)
        .patch("/api/articles/9999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Article not found");
        });
    });
    test("returns 404 status for valid article_id but no resource found", () => {
      return request(app)
        .patch("/api/articles/99999")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Article not found");
        });
    });
    test("returns 400 status for article_id NaN", () => {
      return request(app)
        .patch("/api/articles/not-a-number")
        .send({ inc_votes: 10 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });

    test("returns 400 status for malformed request (missing values)", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('returns 204 status and no content for a valid comment_id', () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
   
  });
  describe("Error handling 400, 404", () => {
    test('returns 400 status for comment_id NaN', () => {
      return request(app)
        .delete("/api/comments/not-a-number")
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Bad request');
        });
    });
  
    test('returns 404 status for valid comment_id but no resource found', () => {
      return request(app)
        .delete("/api/comments/9999") 
        .expect(404)
        .then((response) => {
          expect(response.body.message).toBe('Comment not found');
        });
    });
  });
});
describe("GET /api/users", () => {
  test("return 200 status, should return an array of users object", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
const { users } = body
        expect(users.length).toBeGreaterThan(0);
        expect(Array.isArray(users)).toBe(true);
        users.forEach((users) => {
          expect(users).toHaveProperty("name");
          expect(users).toHaveProperty("username");
          expect(users).toHaveProperty("avatar_url");
        });
      });
  });
});



