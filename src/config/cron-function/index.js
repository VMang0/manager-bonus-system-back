import cron from "node-cron";
import TaskService from "../../services/TaskService.js";

export const startCronJobs = () => {
  cron.schedule('*/10 * * * *', async () => {
    try {
      await TaskService.expiredTasks();
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });
};