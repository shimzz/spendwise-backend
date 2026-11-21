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

    // Pehle check karein ke is date range ka budget pehle se hai ya nahi
    // Agar hai toh update karein, warna naya banayein
    let budget = await Budget.findOne({
      user: req.user.id,
      startDate,
      endDate,
    });

    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({
        user: req.user.id,
        amount,
        startDate,
        endDate,
      });
    }

    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Current active budget get karein
// @route   GET /api/budget
const getBudget = async (req, res) => {
  try {
    const today = new Date();

    // Aaj ki date ke hisaab se active budget dhoondein
    const budget = await Budget.findOne({
      user: req.user.id,
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    res
      .status(200)
      .json(budget || { amount: 0, startDate: null, endDate: null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { setBudget, getBudget };
