const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

const getDashboardStats = async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Totals (Income/Expense) - Yahan userId fix kiya
    const totals = await Transaction.aggregate([
      { $match: { userId: currentUserId } },
      { $group: { _id: "$type", totalAmount: { $sum: "$amount" } } },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    totals.forEach((item) => {
      if (item._id === "income") totalIncome = item.totalAmount;
      if (item._id === "expense") totalExpense = item.totalAmount;
    });
    const balance = totalIncome - totalExpense;

    // 2. Category Stats - Yahan userId fix kiya
    const categoryStats = await Transaction.aggregate([
      { $match: { userId: currentUserId, type: "expense" } },
      { $group: { _id: "$category", value: { $sum: "$amount" } } },
      { $sort: { value: -1 } },
    ]);

    // 3. Recent Transactions - Yahan userId fix kiya
    const recentTransactions = await Transaction.find({ userId: currentUserId })
      .sort({ date: -1 })
      .limit(5);

    // 4. Monthly Stats - Yahan userId fix kiya
    const monthlyStats = await Transaction.aggregate([
      { $match: { userId: currentUserId } },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedMonthly = {};

    monthlyStats.forEach((stat) => {
      const monthName = monthNames[stat._id.month];
      if (!formattedMonthly[monthName]) {
        formattedMonthly[monthName] = {
          name: monthName,
          income: 0,
          expense: 0,
        };
      }
      if (stat._id.type === "income")
        formattedMonthly[monthName].income = stat.total;
      if (stat._id.type === "expense")
        formattedMonthly[monthName].expense = stat.total;
    });

    const barChartData = Object.values(formattedMonthly);

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance,
      categoryStats,
      recentTransactions,
      barChartData,
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
