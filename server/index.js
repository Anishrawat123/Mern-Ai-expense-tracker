import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

const app = express();


// -------- DATABASE --------
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log("MongoDB Connected");

    // If a leftover unique index on `username` exists it can cause duplicate
    // key errors when documents don't have that field (null). Drop that
    // stale index if present so registrations without `username` succeed.
    try {
        const usersColl = mongoose.connection.db.collection('users');
        const indexes = await usersColl.indexes();
        const hasUsernameIndex = indexes.some(idx => idx.name === 'username_1');
        if (hasUsernameIndex) {
            await usersColl.dropIndex('username_1');
            console.log('Dropped stale index: username_1 on users collection');
        }
    } catch (err) {
        // Ignore index-not-found and log other issues
        if (err && err.codeName && err.codeName === 'IndexNotFound') {
            // nothing to do
        } else if (err && /ns not found/.test(err.message)) {
            // collection doesn't exist yet
        } else {
            console.log('Error while checking/dropping indexes:', err.message || err);
        }
    }
})
.catch(err=>console.log(err));
// console.log("JWT_SECRET:",process.env.JWT_SECRET);


// -------- GLOBAL MIDDLEWARE --------
app.use(express.json());   // BODY PARSER (VERY IMPORTANT)
app.use(cors());           // CORS


// -------- ROUTES --------
app.use("/api/auth",authRoutes);
app.use("/api/expenses",expenseRoutes);


// -------- TEST ROUTE --------
app.get("/",(req,res)=>{
    res.send("Smart Expense Tracker API Running");
});


// -------- ERROR HANDLER --------
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON in request body' });
    }
    next(err);
});


app.listen(5000,()=>{
    console.log("Server running on port 5000");
});