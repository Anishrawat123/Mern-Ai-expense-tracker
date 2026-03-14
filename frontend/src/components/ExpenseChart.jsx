import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseChart({ expenses }) {
    const categoryTotals = {};
     expenses.forEach((expense)=>{
        if(categoryTotals[expense.category]){
            categoryTotals[expense.category]+=expense.amount;
        }else{
            categoryTotals[expense.category] = expense.amount;
        }
     });

     const data = {
        labels:Object.keys(categoryTotals),
        datasets:[
            {
                label:"Expenses",
                data:Object.values(categoryTotals),
            },
        ],
     };

     return(
        <div className="bg-green-300 p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 ">Expense Chart</h2>
        <Pie data={data}/>
        </div>
     );
}

export default ExpenseChart;