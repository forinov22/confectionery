const express = require('express');
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware')

const userRouter = express.Router();

userRouter.get('/', authMiddleware.isAuthenticated, usersController.getUsers);

module.exports = userRouter;
