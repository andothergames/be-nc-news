const app = require("../app/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const fs = require("fs/promises");
const path = require("path");
const endpointsPath = path.join(__dirname, "..", "endpoints.json");

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
        const endpoints = JSON.parse(body.res.text);
        expect(typeof endpoints).toBe("object");
        const api = /\/api/;
        const keysArray = Object.keys(endpoints);
        keysArray.forEach((key) => {
          expect(api.test(key)).toBeTruthy();
        });
        for (let key in endpoints) {
          const object = endpoints[key];
          expect(object.hasOwnProperty("description")).toBeTruthy();
          expect(object.hasOwnProperty("queries")).toBeTruthy();
          expect(object.hasOwnProperty("exampleResponse")).toBeTruthy();
        }
      });
  });
});

describe("GET /api", () => {
  test("returns data that matches length of JSON endpoints file", () => {
    fs.readFile(endpointsPath, "utf-8").then((data) => {
      const parsedEndpoints = JSON.parse(data);
      const JSONlength = Object.keys(parsedEndpoints).length;
      return request(app)
        .get("/api")
        .expect(200)
        .then((body) => {
          const APIendpoints = JSON.parse(body.res.text);
          expect(Object.keys(APIendpoints)).toHaveLength(JSONlength);
        });
    });
  });
});

describe("GET /api", () => {
  test("returns data that directly compares to endpoints JSON file", () => {
    fs.readFile(endpointsPath, "utf-8").then((data) => {
      const parsedEndpoints = JSON.parse(data);
      return request(app)
        .get("/api")
        .expect(200)
        .then((body) => {
          const APIendpoints = JSON.parse(body.res.text);
          expect(parsedEndpoints).toEqual(APIendpoints);
        });
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET:200 returns an array containing a specific article by given id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((body) => {
        const article = JSON.parse(body.res.text);
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
});

describe("GET /api/articles/badRequest", () => {
  test("GET:400 returns bad request when article id is not a number", () => {
    return request(app)
      .get("/api/articles/cabbage")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/14", () => {
  test("GET:404 returns correct message when article does not exist", () => {
    return request(app)
      .get("/api/articles/14")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article does not exist");
      });
  });
});

describe("GET /api/articles", () => {
  test("GET:200 returns array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(Array.isArray(body)).toBeTruthy();
        expect(body).toHaveLength(13);
      });
  });
  test("GET:200 returns array of articles with correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.forEach((article) => {
          expect(article).toHaveProperty("comment_count", expect.any(Number));
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
      });
  });
  test("GET:200 returns array of articles correctly ordered by created_at in descending date order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSorted({ key: "created_at", descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET:200 returns array of comments for specific article that has comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(Array.isArray(body)).toBeTruthy();
        expect(body).toHaveLength(11);
      });
  });
  test("GET:200 returns empty array of comments for specific article that has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(Array.isArray(body)).toBeTruthy();
        expect(body).toHaveLength(0);
      });
  });
  test("GET:200 returns array of comments with correct properties", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        body.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("GET:200 returns array of comments correctly ordered by created_at in descending date order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSorted({ key: "created_at", descending: true });
      });
  });
  test("GET:404 returns does not exist error message if article doesn't exist", () => {
    return request(app)
      .get("/api/articles/18/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
  test("GET:400 returns bad request error message if article_id is not a number", () => {
    return request(app)
      .get("/api/articles/article/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST:201 returns newly posted comment", () => {
    const newComment = {
      author: "rogersop",
      body: "What a cool and groovy article you have",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.body).toBe(
          "What a cool and groovy article you have"
        );
        expect(body.comment.author).toBe("rogersop");
        expect(body.comment).toHaveProperty("comment_id");
        expect(body.comment).toHaveProperty("votes");
        expect(body.comment).toHaveProperty("author");
        expect(body.comment).toHaveProperty("body");
        expect(body.comment).toHaveProperty("created_at");
        expect(body.comment).toHaveProperty("article_id");
      });
  });
  test("POST:404 returns error message when article does not exist", () => {
    const newComment = {
      author: "rogersop",
      body: "What a cool and groovy article you have",
    };
    return request(app)
      .post("/api/articles/100/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
  test("POST:400 returns bad request error message when article isn't a number", () => {
    const newComment = {
      author: "rogersop",
      body: "What a cool and groovy article you have",
    };
    return request(app)
      .post("/api/articles/thisarticle/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
