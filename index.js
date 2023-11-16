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

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
//app.use(express.static('static'));
app.use(fileUpload({}));
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
}));

app.use('/api', userRouter)
app.use('/api/company', companyRouter)
app.use('/api/category', categoryRouter)
app.use('/api/priority', priorityRouter)
app.use('/api/project', projectRouter)

app.use(errorMiddlewares);

async function startApp() {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(port, () => console.log('server started on port: ' + port))
  } catch (e) {
    console.log(e);
  }
}
startApp();
