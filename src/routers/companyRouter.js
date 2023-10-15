import Router from "express";
import CompanyController from "../controllers/CompanyController.js";

const companyRouter = new Router();

companyRouter.post('/companies', CompanyController.create)
companyRouter.get('/companies', CompanyController.getAll)
companyRouter.get('/companies/:id', CompanyController.getOne)
companyRouter.put('/companies', CompanyController.update)
companyRouter.delete('/companies/:id', CompanyController.delete)

export default companyRouter;