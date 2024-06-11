import Router from 'express';
import ByCategoryController from '../../controllers/analytics/ByCategoryController.js';
import ByMonthController from '../../controllers/analytics/ByMonthController.js';

const analyticsRouter = new Router();

analyticsRouter.get('/category', ByCategoryController.getDefaultData)
analyticsRouter.get('/month', ByMonthController.getDefaultData)

export default analyticsRouter;