import Router from 'express'
import CompanySettingsController from "../../controllers/CompanySettingsController.js";

const CompanySettingsRouter = new Router();

CompanySettingsRouter.post('/', CompanySettingsController.add)
CompanySettingsRouter.get('/:companyId', CompanySettingsController.getOne)
CompanySettingsRouter.get('/', CompanySettingsController.getAll)
CompanySettingsRouter.put('/', CompanySettingsController.update)
CompanySettingsRouter.post('/culc/:companyId', CompanySettingsController.culcBall)


export default CompanySettingsRouter;