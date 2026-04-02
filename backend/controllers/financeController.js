const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

exports.getSummary = async (req, res) => {
  try {
    // 🔍 STEP 1: Build the Query
    let matchQuery = { isDeleted: false };

    // 🕵️ THE ROLE FIX
    // We force the role to lowercase to avoid "Viewer" vs "viewer" bugs
    const userRole = req.user && req.user.role ? req.user.role.toLowerCase() : 'admin';

    if (userRole !== 'viewer') {
      // If NOT a Viewer, we strictly filter by the User's ObjectId
      matchQuery.user = new mongoose.Types.ObjectId(req.user._id);
      console.log(`--- Dashboard: PRIVATE VIEW for ${req.user.email} ---`);
    } else {
      // If Viewer, we leave matchQuery as { isDeleted: false }
      // This ignores the 'user' field entirely and sums EVERYTHING in the DB.
      console.log(`--- Dashboard: GLOBAL VIEW for ${req.user.email} ---`);
    }

    // 📊 Pipeline 1: Calculate Totals
    const stats = await Transaction.aggregate([
      { $match: matchQuery }, 
      {
        $group: {
          _id: null,
          totalIncome: { 
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } 
          },
          totalExpense: { 
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } 
          }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : { totalIncome: 0, totalExpense: 0 };
    
    // 🗂️ Pipeline 2: Category breakdown
    const categories = await Transaction.aggregate([
      { $match: matchQuery },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]);

    res.status(200).json({ 
      netBalance: result.totalIncome - result.totalExpense, 
      totalIncome: result.totalIncome,
      totalExpense: result.totalExpense,
      categories 
    });

  } catch (err) {
    console.error("Aggregation Error:", err.message);
    res.status(500).json({ message: "Summary failed", error: err.message });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { amount, type, category, description } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Valid positive amount is required" });
    }

    const record = await Transaction.create({
      amount: Number(amount),
      type,
      category,
      description: description || "",
      user: req.user._id, 
      isDeleted: false
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: "Validation Error", error: err.message });
  }
};