import Router from 'express'
import ChartsController from "../../controllers/ChartsController.js";

const chartsRouter = new Router();

chartsRouter.get('/line/:companyId', ChartsController.getDataForLinecharts)

export default chartsRouter;