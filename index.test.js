const request = require("supertest");
const app = require("./src/app");
const db = require("./db/connection");
const { syncSeed } = require("./seed");

beforeEach(async () => {
  await db.sync({ force: true });
  await syncSeed();
});

describe("Fresh harverst fruits API:", () => {
  describe("./users endpoint tests:", () => {
    it("POST should only update database if a name is provided", async () => {
      const sentData = {
        name: " ",
        age: 18,
      };
      const response = await request(app).post("/users").send(sentData);
      expect(response.body).toBe("name");
    });
  });
});
