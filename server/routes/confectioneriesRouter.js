const express = require('express');
const upload = require('../config/multer')

const confectioneryController = require('../controllers/confectioneriesController');

const confectioneryRouter = express.Router();

confectioneryRouter.get('/', confectioneryController.getConfectioneries);
confectioneryRouter.get('/:id', confectioneryController.getConfectioneryById)
confectioneryRouter.post('/', upload.single('image'), confectioneryController.createConfectionery)
confectioneryRouter.put('/:id', upload.single('image'), confectioneryController.updateConfectionery)
confectioneryRouter.delete('/:id', confectioneryController.deleteConfectionery)

module.exports = confectioneryRouter;
