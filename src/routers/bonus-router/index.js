import Router from 'express'
import BonusController from "../../controllers/BonusController.js";

const BonusRouter = new Router();

BonusRouter.post('/', BonusController.add)
BonusRouter.put('/', BonusController.update)
BonusRouter.put('/:id', BonusController.delete)
BonusRouter.get('/:company', BonusController.getAll)

export default BonusRouter;