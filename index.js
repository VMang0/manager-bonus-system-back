import express from 'express';
import mongoose from "mongoose";
import userRouter from "./src/routers/userRouter.js";
import fileUpload from 'express-fileupload'
import companyRouter from "./src/routers/companyRouter.js";
import cors from 'cors';

const port = 5000;
const DB_URL = 'mongodb://127.0.0.1:27017/bonus-system';

const app = express();

app.use(express.json());
app.use(express.static('static'));
app.use(fileUpload({}));
app.use(cors());

app.use('/api', userRouter)
app.use('/api', companyRouter)

async function startApp() {
  try {
    await mongoose.connect(DB_URL);
    app.listen(port, () => console.log('server started on port' + port))
  } catch (e) {
    console.log(e);
  }
}
startApp();
