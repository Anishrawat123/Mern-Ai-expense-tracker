import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addExpense,
  getExpenses,
  getMonthlyAnalysis,
  getOverspendingAlert,
  getSmartSummary,
  deleteExpense
} from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", authMiddleware, addExpense);

// Basic expense list
router.get("/", authMiddleware, getExpenses);

// Analytics routes
router.get("/monthly-analysis", authMiddleware, getMonthlyAnalysis);
router.get("/alert", authMiddleware, getOverspendingAlert);
router.get("/summary", authMiddleware, getSmartSummary);

// delete 
router.delete("/:id",authMiddleware, deleteExpense);

export default router;