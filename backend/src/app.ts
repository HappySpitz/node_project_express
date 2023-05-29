import express, { NextFunction, Request, Response } from "express";
import fileUploader from "express-fileupload";
import * as mongoose from "mongoose";

import { configs } from "./configs";
import { ApiError } from "./errors";
import {customerRouter, managerRouter, sellerRouter} from "./routers";
import {adminRouter} from "./routers";
import {cronRunner} from "./crons";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUploader());

app.use("/seller", sellerRouter);
app.use("/manager", managerRouter);
app.use("/admin", adminRouter);
app.use("/buy", customerRouter);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;

  return res.status(status).json({
    message: err.message,
    status,
  });
});

const connectionDB = async () => {
  let dbCon = false;

  while (!dbCon) {
    try {
      console.log('Connecting to database...');
      await mongoose.connect(configs.DB_URL);
      dbCon = true
    } catch (e) {
      console.log('Database unavailable, wait 3 second');
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  }
}

const start = async () => {
  try {
    await connectionDB()
    await cronRunner()
    await app.listen(5000, '0.0.0.0', () => {
      console.log(`Server has started on PORT ${configs.PORT} 🚀🚀🚀`);
    })

  } catch (e) {
    console.log(e);
  }
}


start()
