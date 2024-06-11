import Router from 'express';
import CompanyController from "../../controllers/CompanyController.js";

const companyRouter = new Router();

companyRouter.post('', CompanyController.add)
companyRouter.get('', CompanyController.getAll)

export default companyRouter;