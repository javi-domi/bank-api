import mongoose from "mongoose";

const accountSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  balance: {
    type: Number,
    require: true,
    validate: (balance) => {
      if (balance < 0) {
        throw new Error("Balance precisa ser maior do que 0");
      }
    },
  },
  conta: {
    type: Number,
    require: true,
  },
  agencia: {
    type: Number,
    require: true,
  },
});

const accountModel = mongoose.model("accounts", accountSchema, "accounts");

export { accountModel };
