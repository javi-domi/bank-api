import mongoose from "mongoose";
import { accountModel } from "../models/accountModel.js";

(async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://trabalho:trabalho4@bootcamp.ushnj.mongodb.net/bank?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
  } catch (error) {
    console.log("Erro ao conetar no MongoDB");
  }
})();

const getAgencyAndAccount = async (agency, accountNumber) => {
  const account = await accountModel.findOne({
    agencia: `${agency}`,
    conta: `${accountNumber}`,
  });
  return account;
};

const depositInAgencyAccount = async (agency, accountNumber, value) => {
  const account = await getAgencyAndAccount(agency, accountNumber);

  if (!account) {
    throw new Error("Conta não encontrada");
  }

  const accountModified = await accountModel.findByIdAndUpdate(
    {
      _id: `${account._id}`,
    },
    { $inc: { balance: `${parseInt(value)}` } },
    { new: true }
  );

  return accountModified;
};

const withdrawInAgencyAccount = async (agency, accountNumber, value) => {
  const account = await getAgencyAndAccount(agency, accountNumber);
  if (!account) {
    throw new Error("Conta não encontrada");
  }
  const accountModified = await accountModel.findByIdAndUpdate(
    {
      _id: `${account._id}`,
    },
    { $inc: { balance: -`${parseInt(value)}` - 1 } },
    { new: true }
  );

  return accountModified;
};

//deletting an account
const deleteAccount = async (agency, accountNumber) => {
  const account = await getAgencyAndAccount(agency, accountNumber);
  if (!account) {
    throw new Error("Conta não encontrada");
  }
  await accountModel.findOneAndDelete({ _id: account._id });

  const totalAccounts = await accountModel.countDocuments({
    agencia: `${agency}`,
  });
  return totalAccounts.toString();
};
//getting accounts number
const getAccountNumber = async (accountNumber) => {
  const account = await accountModel.findOne({
    conta: `${accountNumber}`,
  });
  return account;
};

const transferFromAccountToAccount = async (fromAccount, toAccount, value) => {
  const sendingAccount = await getAccountNumber(fromAccount);
  const targetAccount = await getAccountNumber(toAccount);

  let transferValue = parseInt(value);

  if (sendingAccount.agencia !== targetAccount.agencia) {
    transferValue = transferValue + 8;
  }

  const sendingAccountModified = await accountModel.findByIdAndUpdate(
    {
      _id: `${sendingAccount._id}`,
    },
    { $inc: { balance: -`${parseInt(transferValue)}` } },
    { new: true }
  );
  await accountModel.findByIdAndUpdate(
    {
      _id: `${targetAccount._id}`,
    },
    { $inc: { balance: `${parseInt(value)}` } },
    { new: true }
  );

  return sendingAccountModified.balance.toString();
};

//menor saldo en conta
const getMinBalanceQty = async (quantity) => {
  const minBalance = await accountModel
    .find({}, { _id: 0, agencia: 1, conta: 1, balance: 1 })
    .sort({ balance: 1 })
    .limit(+quantity);
  return minBalance;
};

const getMaxBalanceQty = async (quantity) => {
  const minBalance = await accountModel
    .find({}, { _id: 0, agencia: 1, conta: 1, name: 1, balance: 1 })
    .sort({ balance: -1 })
    .limit(+quantity);
  return minBalance;
};

//Balance average
const getAccountsAVG = async (agency) => {
  const result = await accountModel.aggregate([
    { $match: { agencia: parseInt(agency) } },
    { $group: { _id: "$agencia", avgBalance: { $avg: "$balance" } } },
  ]);

  return result[0];
};

const privateAccount = async () => {
  const maxAccounts = await accountModel.aggregate([
    {
      $sort: { agencia: 1, balance: -1 },
    },
    {
      $group: { _id: "$agencia", account: { $first: "$$ROOT" } },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  console.log(maxAccounts);
  for (let i = 0; i < maxAccounts.length; i++) {
    const idPrivate = maxAccounts[i].account._id;
    await accountModel.findByIdAndUpdate(
      {
        _id: `${idPrivate}`,
      },
      { agencia: 99 },
      { new: true }
    );
  }
  const showMaxAccounts = accountModel
    .find({ agencia: 99 })
    .sort({ balance: 1 });
  return showMaxAccounts;
};

export {
  getAgencyAndAccount,
  depositInAgencyAccount,
  withdrawInAgencyAccount,
  deleteAccount,
  getAccountsAVG,
  transferFromAccountToAccount,
  getMinBalanceQty,
  getMaxBalanceQty,
  privateAccount,
};
