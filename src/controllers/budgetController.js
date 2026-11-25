const Budget = require("../models/Budget");

// @desc    Budget set ya update karein
// @route   POST /api/budget
const setBudget = async (req, res) => {
  try {
    const { amount, startDate, endDate } = req.body;

    if (!amount || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Amount, startDate, and endDate are required" });
    }

    // Dates ko proper Date object mein convert karein
    const start = new Date(startDate);
    const end = new Date(endDate);

    // User ka koi bhi purana budget dhoondein (latest)
    let budget = await Budget.findOne({ user: req.user.id }).sort({
      createdAt: -1,
    });

    if (budget) {
      // Agar budget mojood hai, toh usko update karein
      budget.amount = amount;
      budget.startDate = start;
      budget.endDate = end;
      await budget.save();
    } else {
      // Agar nahi hai, toh naya banayein
      budget = await Budget.create({
        user: req.user.id,
        amount,
        startDate: start,
        endDate: end,
      });
    }

    res.status(200).json(budget);
  } catch (error) {
    console.error("Budget Save Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Current active budget get karein
// @route   GET /api/budget
const getBudget = async (req, res) => {
  try {
    // Sab se latest budget fetch karein (taake form mein purana data load ho sake)
    const budget = await Budget.findOne({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res
      .status(200)
      .json(budget || { amount: 0, startDate: null, endDate: null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { setBudget, getBudget };
