import express from "express";
import mongoose from "mongoose";
import { accountRouter } from "./routes/accountRouter.js";
require("dotenv").config({
  path: process.env.DBURL,
})(async () => {
  try {
    await mongoose.connect(`${path}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log("Erro ao conetar no MongoDB");
  }
})();

const app = express();

app.use(express.json());
app.use(accountRouter);

app.listen(3000, () => {
  console.log("API Working...");
});
