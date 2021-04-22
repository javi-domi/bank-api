import express from "express";
import { accountModel } from "../models/accountModel.js";
import {
  getAgencyAndAccount,
  depositInAgencyAccount,
  withdrawInAgencyAccount,
  deleteAccount,
  getAccountsAVG,
  transferFromAccountToAccount,
  getMinBalanceQty,
  getMaxBalanceQty,
  privateAccount,
} from "../controllers/accountController.js";

const app = express();
app.use(express.json());

//um
app.get("/accounts", async (req, res, next) => {
  try {
    const account = await accountModel.find({});
    res.send(account);
  } catch (error) {
    next(error);
  }
});

//quatro
app.put("/deposit/:agency/:accountNumber/:value", async (req, res, next) => {
  try {
    const { agency, accountNumber, value } = req.params;
    const result = await depositInAgencyAccount(agency, accountNumber, value);
    res.send(result.balance.toString());
  } catch (error) {
    next(error);
  }
});

//cinco
app.put("/withdraw/:agency/:accountNumber/:value", async (req, res, next) => {
  try {
    const { agency, accountNumber, value } = req.params;
    const result = await withdrawInAgencyAccount(agency, accountNumber, value);
    res.send(result.balance.toString());
  } catch (error) {
    next(error);
  }
});

//seis
app.get("/accounts/:agency/:accountNumber", async (req, res, next) => {
  try {
    const { agency, accountNumber } = req.params;
    const account = await getAgencyAndAccount(agency, accountNumber);
    res.send(account);
  } catch (error) {
    next(error);
  }
});

//sete
app.delete("/accounts/:agency/:accountNumber", async (req, res, next) => {
  try {
    const { agency, accountNumber } = req.params;
    const account = await deleteAccount(agency, accountNumber);
    res.send(account);
  } catch (error) {
    next(error);
  }
});

//oito
app.put(
  "/transfer/:sendingAccount/:targetAccount/:value",
  async (req, res, next) => {
    try {
      const { sendingAccount, targetAccount, value } = req.params;
      const result = await transferFromAccountToAccount(
        sendingAccount,
        targetAccount,
        value
      );

      res.send(result);
    } catch (error) {
      next(error);
    }
  }
);

//nove
app.get("/accounts/:agency", async (req, res, next) => {
  try {
    const { agency } = req.params;
    const average = await getAccountsAVG(agency);
    res.send(average);
  } catch (error) {
    next(error);
  }
});

//dez
app.get("/showMin/:quantity", async (req, res, next) => {
  try {
    const { quantity } = req.params;
    const result = await getMinBalanceQty(quantity);
    console.log("test");
    res.send(result);
  } catch (error) {
    next(error);
  }
});

//once
app.get("/showMax/:quantity", async (req, res, next) => {
  try {
    const { quantity } = req.params;
    const result = await getMaxBalanceQty(quantity);

    res.send(result);
  } catch (error) {
    next(error);
  }
});

//doce
app.get("/private", async (req, res, next) => {
  try {
    const privAccount = await privateAccount();
    res.send(privAccount);
  } catch (error) {
    next(error);
  }
});

//error
app.use((error, req, res, next) => {
  res.status(500).send("Ocurrio um erro, tente mais tarde " + error);
});

export { app as accountRouter };
