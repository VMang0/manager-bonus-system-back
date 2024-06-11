import Router from 'express'
import ReportsHistoryController from "../../controllers/ReportsHistoryController.js";

const ReportsHistoryRouter = new Router();

ReportsHistoryRouter.get('/:taskId', ReportsHistoryController.getAllTasksReports)

export default ReportsHistoryRouter;