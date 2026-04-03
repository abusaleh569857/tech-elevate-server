import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import corsOptions from "./config/cors.js";
import apiRouter from "./routes/index.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("TechElevate Server is Running!");
});

app.use("/", apiRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
