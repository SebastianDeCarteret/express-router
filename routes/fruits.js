const express = require("express");
const router = express.Router();
const { Fruit } = require("../models/index");
const { response } = require("../src/app");
const { check, validationResult } = require("express-validator");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", async (request, response) => {
  const users = await Fruit.findAll();
  response.json(users);
});

router.get("/:id", async (request, response) => {
  const user = await Fruit.findByPk(request.params.id);
  response.json(user);
});

router.post(
  "/",
  [
    check(["name", "color"]).notEmpty().not().contains(" "),
    check("name").isLength({ min: 5, max: 20 }),
  ],
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.json({ error: errors.array() });
    } else {
      await Fruit.create(request.body);
      response
        .status(201)
        .send(
          `Created a new fruit with a name of: ${request.body.name} and an color of: ${request.body.color}`
        );
    }
  }
);

router.put("/:id", async (request, response) => {
  const user = await Fruit.findByPk(Number(request.params.id));
  await user.update(request.body);
  response
    .status(200)
    .send(
      request.body.name && request.body.age != undefined
        ? `Updated the fruit that has an id of: ${request.params.id} with name: ${request.body.name} and color: ${request.body.color}`
        : request.body.name != undefined
        ? `Updated the fruit that has an id of: ${request.params.id} with name: ${request.body.name}`
        : request.body.color != undefined
        ? `Updated the fruit that has an id of: ${request.params.id} with color: ${request.body.color}`
        : "No values provided!"
    );
});

router.delete("/:id", async (request, response) => {
  const user = await Fruit.findByPk(Number(request.params.id));
  user.destroy();
  response
    .status(200)
    .send(
      `Deleted user with an id of: ${user.id} who was called: ${user.name} and color was: ${user.color}`
    );
});

module.exports = router;
