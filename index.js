import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from "mongoose";
import fileUpload from 'express-fileupload'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorMiddlewares from "./src/middlewares/error-middlewares.js";
import userRouter from "./src/routers/user-router/index.js";
import companyRouter from "./src/routers/company-router/index.js";
import categoryRouter from "./src/routers/category-router/index.js";
import projectRouter from "./src/routers/project-router/index.js";
import bonusRouter from "./src/routers/bonus-router/index.js";
import companySettingsRouter from "./src/routers/company-settings-router/index.js";
import taskRouter from "./src/routers/task-router/index.js";
import reportsHistoryRouter from "./src/routers/reports-history-router/index.js";
import { startCronJobsWithBonus } from "./src/config/cron-function/index.js";
import bonusRequestRouter from "./src/routers/bonus-request-router/index.js";
import chartsRouter from "./src/routers/charts-router/index.js";
import authMiddlewares from './src/middlewares/auth-middlewares.js';
import authRouter from './src/routers/auth-router/index.js';
import analyticsRouter from './src/routers/analytics-router/index.js';

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static('static/users-images'));
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
}));
app.use(fileUpload({
  limits: { fileSize: Infinity },
}));


app.use('/api', authRouter)
app.use('/api/companies', companyRouter)

app.use(authMiddlewares)
app.use('/api', userRouter)
app.use('/api/project', projectRouter)
app.use('/api/category', categoryRouter)
app.use('/api/task', taskRouter)
app.use('/api/report', reportsHistoryRouter)
app.use('/api/settings', companySettingsRouter)
app.use('/api/bonus', bonusRouter)
app.use('/api/request', bonusRequestRouter)

app.use('/api/analytics', analyticsRouter)

app.use('/api/charts', chartsRouter)

app.use(errorMiddlewares);

startCronJobsWithBonus();

async function startApp() {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(port, () => console.log('server started on port: ' + port))
  } catch (e) {
    console.log(e);
  }
}
startApp();
export default app;