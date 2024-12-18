const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const ordersController = require("../controllers/ordersController");

const ordersRouter = express.Router();

ordersRouter.get(
  "/",
  authMiddleware.hasRole("Employee"),
  ordersController.getOrders,
);
ordersRouter.get(
  "/user",
  authMiddleware.hasRole("Customer"),
  ordersController.getUserOrders,
);
ordersRouter.get(
  "/:id",
  authMiddleware.hasOneOfRoles(["Employee", "Customer"]),
  ordersController.getOrerById,
);
ordersRouter.post(
  "/",
  authMiddleware.hasRole("Customer"),
  ordersController.createOrder,
);

module.exports = ordersRouter;
