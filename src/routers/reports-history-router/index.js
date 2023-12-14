import Router from 'express'
import ReportsHistoryController from "../../controllers/ReportsHistoryController.js";

const ReportsHistoryRouter = new Router();

ReportsHistoryRouter.get('/:id', ReportsHistoryController.getAll)

export default ReportsHistoryRouter;