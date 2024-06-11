import Router from 'express'
import BonusRequestController from "../../controllers/BonusRequestController.js";

const BonusRequestRouter = new Router();

BonusRequestRouter.post('', BonusRequestController.add)
BonusRequestRouter.get('', BonusRequestController.getAll)
BonusRequestRouter.put('', BonusRequestController.updateRequest)


/*BonusRequestRouter.get('/waiting/:companyId', BonusRequestController.getAllWaitingRequest)
BonusRequestRouter.get('/all/:userId', BonusRequestController.getAllUsersRequest)
BonusRequestRouter.get('/top5/:companyId', BonusRequestController.getTop5PopularBonusesThisMonth)*/

export default BonusRequestRouter;