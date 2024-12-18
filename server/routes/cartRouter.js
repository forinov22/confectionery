const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const cartController = require("../controllers/cartController");

const cartRouter = express.Router();

// cartRouter.use(authMiddleware.isAuthenticated)

cartRouter.get(
  "/",
  authMiddleware.isAuthenticated,
  cartController.getCartItems,
);
cartRouter.post("/items", cartController.addCartItem);
cartRouter.delete("/items/:id", cartController.removeCartItem);
cartRouter.put("/items/:id", cartController.updateCartItemQuantity);
cartRouter.delete("/", cartController.clearCart);

module.exports = cartRouter;
