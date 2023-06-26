const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const topics = require("../db/data/test-data/topics");

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
        expect(body.topics.length).toBeGreaterThan(0)
        expect(Array.isArray(body.topics)).toBe(true)
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
          
      });
  });
});
});
