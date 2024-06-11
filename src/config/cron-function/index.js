import cron from "node-cron";
import BonusRequestService from "../../services/BonusRequestService.js";

export const startCronJobsWithBonus = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      await BonusRequestService.expiredRequest();
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });
};