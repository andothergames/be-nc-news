const app = require("../app/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("GET:200 sends an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("GET /api/banana", () => {
  test("GET:404 Not Found on endpoint that doesn't exist", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then((body) => {
        expect(body.res.statusMessage).toBe("Not Found");
      });
  });
});

describe("GET /api", () => {
    test("GET:200 sends an object describing all endpoints available", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((body) => {
            const endpoints = JSON.parse(body.res.text)
            expect(typeof endpoints).toBe('object');
            expect(Array.isArray(endpoints)).toBeTruthy();
            const api = /\/api/;
            endpoints.forEach((object) => {
                const keysArray = Object.keys(object);
                keysArray.forEach((key) => {
                    expect(api.test(key)).toBeTruthy();
                })
            });
            endpoints.forEach((object) => {
                const objectKey = Object.values(object)[0];
                expect(objectKey.hasOwnProperty('description')).toBeTruthy();
                expect(objectKey.hasOwnProperty('queries')).toBeTruthy();
                expect(objectKey.hasOwnProperty('exampleResponse')).toBeTruthy();
            })
        });
    });
  });
  