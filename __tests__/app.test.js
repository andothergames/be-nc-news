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
        body.topics.forEach((object) => {
          expect(object).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
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
        const api = /\/api/;
        const keysArray = Object.keys(endpoints);
        keysArray.forEach((key) => {
          expect(api.test(key)).toBeTruthy();
        });
        for (let key in endpoints) {
          const object = endpoints[key];
          expect(object).toMatchObject({
            description: expect.any(String),
            queries: expect.any(Object),
            exampleResponse: expect.any(Object),
          });
        }
      });
  });
  test("GET:200 returns data that matches length of JSON endpoints file", () => {
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
  test("GET:200 returns data that directly compares to endpoints JSON file", () => {
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
        expect(article.article_id).toBe(1);
        expect(article).toMatchObject({
          comment_count: expect.any(Number),
          author: expect.any(String),
          article_id: expect.any(Number),
          title: expect.any(String),
          body: expect.any(String),
          topic: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
        });
      });
  });
  test("GET:400 returns bad request when article id is not a number", () => {
    return request(app)
      .get("/api/articles/cabbage")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
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
        expect(body).toHaveLength(13);
      });
  });
  test("GET:200 returns array of articles with correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.forEach((article) => {
          expect(article).toMatchObject({
            comment_count: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
          });
          expect(article).not.toHaveProperty("body");
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
        expect(body).toHaveLength(11);
      });
  });
  test("GET:200 returns empty array of comments for specific article that has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(0);
      });
  });
  test("GET:200 returns array of comments with correct properties", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        body.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            article_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
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
        expect(body.comment.author).toBe("rogersop");
        expect(body.comment.body).toBe(
          "What a cool and groovy article you have"
        );
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: expect.any(Number),
          author: expect.any(String),
          body: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
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

  test("POST:400 returns bad request error message when request is missing info", () => {
    const newComment = {
      body: "What a cool and groovy article you have",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing information");
      });
  });
  test("POST:400 returns bad request error message when request is missing info", () => {
    const newComment = {
      author: "rogersop",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing information");
      });
  });
  test("POST:400 returns user does not exist", () => {
    const newComment = {
      body: "What a cool and groovy article you have",
      author: "Roger Nobody",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("User does not exist");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH:201 returns article with changed votes when given positive integer", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(201)
      .then(({ body }) => {
        expect(body.votes).toBe(101);
      });
  });
  test("PATCH:201 returns article with changed votes when given negative integer", () => {
    const newVote = { inc_votes: -51 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(201)
      .then(({ body }) => {
        expect(body.votes).toBe(50);
      });
  });
  test("PATCH:201 returns article with changed votes when votes go into the negative", () => {
    const newVote = { inc_votes: -51 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(201)
      .then(({ body }) => {
        expect(body.votes).toBe(-1);
      });
  });
  test("PATCH:400 returns bad request error message when request is missing info - empty object", () => {
    const newVote = {};
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing information");
      });
  });
  test("PATCH:400 returns bad request error message when request is missing info - wrong key", () => {
    const newVote = { my_votes: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing information");
      });
  });
  test("PATCH:400 returns bad request error message when request is missing info - wrong value", () => {
    const newVote = { inc_votes: "like" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH:400 returns error message when article does not exist", () => {
    const newVote = { inc_votes: -51 };
    return request(app)
      .patch("/api/articles/100")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE:204 deletes a comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("DELETE:204 returns error message when comment does not exist", () => {
    return request(app)
      .delete("/api/comments/200")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment does not exist");
      });
  });
  test("DELETE:204 returns bad request error message when comment endpoint is not a number", () => {
    return request(app)
      .delete("/api/comments/hello")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("GET:200 return array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(4);
        body.forEach((object) => {
          expect(object).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles?topic=:topic", () => {
  test("GET:200 return array of articles that match topic query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(1);
        body.forEach((object) => {
          expect(object).toMatchObject({
            comment_count: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "cats",
            votes: expect.any(Number),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("GET:404 return error if topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=notatopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic does not exist");
      });
  });
  test("GET:200 return empty array if topic does exist but no articles are assigned", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(0);
      });
  });
  test("GET:400 return bad request error if query is not allowed", () => {
    return request(app)
      .get("/api/articles?topic=notatopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic does not exist");
      });
  });
});

describe("GET /api/articles?sort_by=topic&order=asc", () => {
  test("GET:200 return array of articles sorted by topic in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSorted({ key: "topic", ascending: true });
      });
  });
  test("GET:200 return array of articles sorted by topic in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=desc")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSorted({ key: "topic", descending: true });
      });
  });
  test("GET:200 return array of articles sorted by created_at in ascending order when no sort_by set", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSorted({ key: "created_at", ascending: true });
      });
  });
  test("GET:200 return array of articles of a certain topic sorted by created_at in descending order when no sort_by or order set", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSorted({ key: "created_at", descending: true });
        body.forEach((object) => {
          expect(object.topic).toBe("mitch");
        });
      });
  });
  test("GET:200 return array of articles of a certain topic sorted by specified key in specified order", () => {
    return request(app)
      .get("/api/articles?topic=mitch&order=asc&sort_by=author")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSorted({ key: "author", ascending: true });
        body.forEach((object) => {
          expect(object.topic).toBe("mitch");
        });
      });
  });
  test("GET:400 return bad request error if sort_by value does not exist in the database", () => {
    return request(app)
      .get("/api/articles?sort_by=favecolour")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("sort_by value does not exist");
      });
  });
  test("GET:400 return bad request error if order value is invalid", () => {
    return request(app)
      .get("/api/articles?order=myorder")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
