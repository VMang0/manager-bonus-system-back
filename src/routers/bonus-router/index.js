import Router from 'express'
import BonusController from "../../controllers/BonusController.js";

const BonusRouter = new Router();

BonusRouter.post('/add', BonusController.add)
BonusRouter.get('/all/:company', BonusController.getAll)
BonusRouter.post('/dur', BonusController.adddur)

export default BonusRouter;