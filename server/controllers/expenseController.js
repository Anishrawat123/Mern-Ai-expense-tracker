import Expense from "../models/Expense.js";

// ADD EXPENSE
export const addExpense = async(req,res)=>{
    try{
        const {title,amount} = req.body;

        const category = predictCategory(title);

        const expense = await Expense.create({
            user: req.user,
            title,
            amount,
            category
        });

        res.status(201).json(expense);
    } 
    catch(error){
        res.status(500).json({message:error.message});
    }
};


// GET ALL EXPENSES
export const getExpenses = async(req,res)=>{
    try{
        const expenses = await Expense.find({user:req.user});
        res.json(expenses);
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
};


// MONTHLY ANALYSIS
export const getMonthlyAnalysis = async(req,res)=>{
    try{
        const expenses = await Expense.find({user:req.user});

        if(expenses.length ===0){
            return res.json({message:"No expenses found"});
        }

        let total =0; 
        let categoryMap = {};
        let highest = 0;

        expenses.forEach(exp =>{
            total +=exp.amount;

            if(exp.amount > highest){
                highest = exp.amount;
            }

            if(categoryMap[exp.category]){
                categoryMap[exp.category] +=exp.amount;
            }
            else{
                categoryMap[exp.category] = exp.amount;
            }
        });

        let topCategory = Object.keys(categoryMap).reduce((a,b)=>
        categoryMap[a]>categoryMap[b]?a:b);

        res.json({
            totalSpent:total,
            topCategory,
            highestExpense:highest,
            categoryBreakdown:categoryMap
        });

    }catch(error){
        res.status(500).json({message:error.message});
    }
};


// SMART CATEGORY PREDICTION
const predictCategory = (title)=>{
    const text = title.toLowerCase();

    if(text.includes("uber") || text.includes("ola") || text.includes("bus") || text.includes("petrol"))
        return "Transport";

    if(text.includes("pizza") || text.includes("dominos") || text.includes("burger") || text.includes("food"))
        return "Food";

    if(text.includes("amazon") || text.includes("flipkart") || text.includes("shopping"))
        return "Shopping";

    if(text.includes("movie") || text.includes("netflix"))
        return "Entertainment";
        
    return "Other";
};


// 🔴 OVERSPENDING ALERT (FIXED)
export const getOverspendingAlert = async (req,res)=>{
    try{

        const expenses = await Expense.find({user:req.user});
        if(expenses.length ===0){
          return res.json({alert:""})
        }

        let categoryTotal = {};

        expenses.forEach((expense)=>{
            if(categoryTotal[expense.category]){
                categoryTotal[expense.category] += expense.amount;
            }else{
                categoryTotal[expense.category] = expense.amount;
            }
        });

        let alert = "";

        for(let category in categoryTotal){
            if(categoryTotal[category] > 5000){
                alert = `⚠️ You are overspending on ${category}`;
                break;
            }
        }

        if(!alert){
            alert = "Spending is normal. 👍";
        }

        res.json({alert});

    }catch(error){
        res.status(500).json({message:error.message});
    }
};


// AI SMART SUMMARY
export const getSmartSummary = async (req,res)=>{
    try{
        const expenses = await Expense.find({user:req.user});

        if(expenses.length === 0){
            return res.json({message:"No expenses found"});
        }

        let total= 0;
        let categoryMap = {};

        expenses.forEach(exp =>{
            total +=exp.amount;
            categoryMap[exp.category] =(categoryMap[exp.category] || 0)+ exp.amount;
        });

        const topCategory = Object.keys(categoryMap).reduce((a,b)=>
        categoryMap[a]>categoryMap[b]?a:b);

        let summary = `This month you spent ₹${total}. `;
        summary += `Your highest spending category is ${topCategory}. `;

        if(categoryMap[topCategory] > total*0.4){
            summary += `A large portion of your expenses is going towards ${topCategory}. Consider monitoring it.`;
        }
        else{
            summary += `Your spending distribution looks balanced.`;
        }

        res.json({summary});

    }catch(error){
        res.status(500).json({message:error.message});
    }
};


// DELETE EXPENSE
export const deleteExpense = async(req,res)=>{
    try{
        const expense = await Expense.findById(req.params.id);

        if(!expense){
            return res.status(404).json({message:"Expense not found"});
        }

        await expense.deleteOne();

        res.json({message:"Expense deleted successfully"});

    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
};