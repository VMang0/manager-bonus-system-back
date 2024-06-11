import Router from 'express'
import CompanySettingsController from "../../controllers/CompanySettingsController.js";

const CompanySettingsRouter = new Router();

CompanySettingsRouter.get('', CompanySettingsController.getSettings)
CompanySettingsRouter.put('', CompanySettingsController.updateSettings)
CompanySettingsRouter.post('/calculate', CompanySettingsController.calculateBall)

export default CompanySettingsRouter;