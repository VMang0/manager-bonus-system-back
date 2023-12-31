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
import priorityRouter from "./src/routers/priority-router/index.js";
import projectRouter from "./src/routers/project-router/index.js";
import bonusRouter from "./src/routers/bonus-router/index.js";
import companySettingsRouter from "./src/routers/company-settings-router/index.js";
import taskRouter from "./src/routers/task-router/index.js";
import taskComplexityRouter from "./src/routers/task-complexity-router/index.js";
import reportsHistoryRouter from "./src/routers/reports-history-router/index.js";
import {startCronJobs} from "./src/config/cron-function/index.js";

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

app.use('/api', userRouter)
app.use('/api/company', companyRouter)
app.use('/api/category', categoryRouter)
app.use('/api/priority', priorityRouter)
app.use('/api/project', projectRouter)
app.use('/api/bonus', bonusRouter)
app.use('/api/settings', companySettingsRouter)
app.use('/api/task', taskRouter)
app.use('/api/complexity', taskComplexityRouter)
app.use('/api/reports', reportsHistoryRouter)

app.use(errorMiddlewares);

startCronJobs();

async function startApp() {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(port, () => console.log('server started on port: ' + port))
  } catch (e) {
    console.log(e);
  }
}
startApp();
