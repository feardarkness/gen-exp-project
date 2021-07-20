const express = require("express");
const router = express.Router();
const asyncWrapper = require("../lib/asyncWrapper");
const userService = require("../services/user");
const ValidationError = require("../errors/ValidationError");

router.get(
  "/:userId",
  asyncWrapper(async (req, res) => {
    res.json({
      get: "get userId",
    });
  })
);

router.get(
  "/",
  asyncWrapper(async (req, res) => {
    const response = await userService.getAll();
    res.json({
      data: response.data,
      status: response.status,
    });
  })
);

router.post(
  "/",
  asyncWrapper(async (req, res) => {
    const { name, gender, email, status } = req.body;
    const response = await userService.post({
      name,
      gender,
      email,
      status,
    });

    if (response.status !== 201) {
      throw new ValidationError("Failed to create the entity");
    }

    res.json(response.data);
  })
);

router.delete(
  "/:userId",
  asyncWrapper(async (req, res) => {
    res.json({
      get: "delete",
    });
  })
);

router.put(
  "/:userId",
  asyncWrapper(async (req, res) => {
    res.json({
      get: "put",
    });
  })
);

module.exports = router;
