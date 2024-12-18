const express = require('express');
const router = express.Router();
const userRouter = require('./userRouter');
const confectioneryRouter = require('./confectioneriesRouter');
const confectioneryCategoryRouter = require('./confectioneryCategoryRouter');
const ordersRouter = require('./ordersRouter');
const cartRouter = require('./cartRouter');
const authRouter = require('./authRouter')

router.use('/auth', authRouter)
router.use('/users', userRouter);
router.use('/confectioneries', confectioneryRouter);
router.use('/confectioneryCategories', confectioneryCategoryRouter);
router.use('/orders', ordersRouter);
router.use('/cart', cartRouter);

module.exports = router;
