import express, { NextFunction, Request, Response } from "express";
import fileUploader from "express-fileupload";
import * as mongoose from "mongoose";

import { configs } from "./configs";
import { cronRunner } from "./crons";
import { ApiError } from "./errors";
import {
  adminRouter,
  customerRouter,
  managerRouter,
  sellerRouter,
} from "./routers";

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

app.listen(configs.PORT, () => {
  mongoose.connect(configs.DB_URL).then();
  cronRunner();
  console.log(`Server has started on PORT ${configs.PORT} :)`);
});
