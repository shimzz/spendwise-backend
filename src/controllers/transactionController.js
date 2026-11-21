const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

const getUserId = (req) => req.user._id || req.user.id;

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/transactions?type=&category=&search=&from=&to=
const getTransactions = async (req, res) => {
  try {
    const { type, category, search, from, to } = req.query;
    const filter = { userId: getUserId(req) };

    if (type && ["income", "expense"].includes(type)) filter.type = type;
    if (category) filter.category = category;

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ category: regex }, { description: regex }];
    }

    const transactions = await Transaction.find(filter).sort({
      date: -1,
      createdAt: -1,
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/transactions
const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, description } = req.body;

    if (!type || !amount || !category) {
      return res
        .status(400)
        .json({ message: "Type, amount and category are required" });
    }
    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const transaction = await Transaction.create({
      userId: getUserId(req),
      type,
      amount: Number(amount),
      category,
      date: date || Date.now(),
      description,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid transaction id" });
    }

    const transaction = await Transaction.findOne({
      _id: id,
      userId: getUserId(req),
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const { type, amount, category, date, description } = req.body;

    if (type !== undefined) {
      if (!["income", "expense"].includes(type)) {
        return res.status(400).json({ message: "Invalid transaction type" });
      }
      transaction.type = type;
    }
    if (amount !== undefined) {
      if (Number(amount) <= 0) {
        return res
          .status(400)
          .json({ message: "Amount must be greater than 0" });
      }
      transaction.amount = Number(amount);
    }
    if (category !== undefined) transaction.category = category;
    if (date !== undefined) transaction.date = date;
    if (description !== undefined) transaction.description = description;

    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid transaction id" });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: getUserId(req),
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};
