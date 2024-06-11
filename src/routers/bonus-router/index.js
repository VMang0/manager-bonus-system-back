import Router from 'express'
import BonusController from "../../controllers/BonusController.js";

const BonusRouter = new Router();

BonusRouter.post('', BonusController.add)
BonusRouter.put('', BonusController.update)
BonusRouter.put('/:bonusId', BonusController.updateStatus)
BonusRouter.get('', BonusController.getAll)

export default BonusRouter;