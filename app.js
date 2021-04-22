import express from "express";
import mongoose from "mongoose";
import { accountRouter } from "./routes/accountRouter.js";

(async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://trabalho:trabalho4@bootcamp.ushnj.mongodb.net/bank_api?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
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
