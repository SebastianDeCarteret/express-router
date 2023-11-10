const express = require("express");
const router = express.Router();
const { User } = require("../models/index");
const { response } = require("../src/app");
const { check, validationResult } = require("express-validator");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", async (request, response) => {
  const users = await User.findAll();
  response.json(users);
});

router.get("/:id", async (request, response) => {
  const user = await User.findByPk(request.params.id);
  response.json(user);
});

router.post(
  "/",
  [
    check(["name", "age"]).notEmpty().not().contains(" "),
    check("name").isLength({ min: 5, max: 15 }),
  ],
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.json({ error: errors.array() });
    } else {
      await User.create(request.body);
      response
        .status(201)
        .send(
          `Created a new user with a name of: ${request.body.name} and an age of: ${request.body.age}`
        );
    }
  }
);

router.put(
  "/:id",
  [
    check(["name", "age"]).notEmpty().not().contains(" "),
    check("name").isLength({ min: 5, max: 15 }),
  ],
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.json({ error: errors.array() });
    } else {
      const user = await User.findByPk(Number(request.params.id));
      await user.update(request.body);
      response
        .status(200)
        .send(
          request.body.name && request.body.age != undefined
            ? `Updated the user that has an id of: ${request.params.id} with name: ${request.body.name} and age: ${request.body.age}`
            : request.body.name != undefined
            ? `Updated the user that has an id of: ${request.params.id} with name: ${request.body.name}`
            : request.body.age != undefined
            ? `Updated the user that has an id of: ${request.params.id} with age: ${request.body.age}`
            : "No values provided!"
        );
    }
  }
);

router.delete("/:id", async (request, response) => {
  const user = await User.findByPk(Number(request.params.id));
  user.destroy();
  response
    .status(200)
    .send(
      `Deleted user with an id of: ${user.id} who was called: ${user.name} and age was: ${user.age}`
    );
});

module.exports = router;
