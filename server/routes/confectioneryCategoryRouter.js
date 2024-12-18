const express = require('express');
const authMiddleware = require('../middleware/authMiddleware')
const confectioneryCategoryController = require('../controllers/confectioneryCategoriesController');

const confectioneryCategoryRouter = express.Router();

confectioneryCategoryRouter.get('/', confectioneryCategoryController.getCategories);
confectioneryCategoryRouter.get('/:id', confectioneryCategoryController.getCategoryById);
confectioneryCategoryRouter.post('/', authMiddleware.hasRole('Employee'), confectioneryCategoryController.createCategory);
confectioneryCategoryRouter.put('/:id', authMiddleware.hasRole('Employee'), confectioneryCategoryController.updateCategory);
confectioneryCategoryRouter.delete('/:id', authMiddleware.hasRole('Employee'), confectioneryCategoryController.deleteCategory);

module.exports = confectioneryCategoryRouter;
