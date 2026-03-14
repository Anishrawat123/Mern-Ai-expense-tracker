import ExpenseChart from "../components/ExpenseChart";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [alert,setAlert]  =useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: ""
  });

  // ---------------- FORM CHANGE ----------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ---------------- FETCH EXPENSES ----------------
  const fetchExpenses = async () => {
    try {
      const expenseRes = await API.get("/expenses");
      setExpenses(expenseRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- FETCH SUMMARY ----------------
  const fetchSummary = async () => {
    try {
      const summaryRes = await API.get("/expenses/summary");
      setSummary(summaryRes.data.summary);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAlert  = async()=>{
    try{
      const res = await API.get("/expenses/alert");
      setAlert(res.data.alert);
    }
    catch(error){
      console.log(error);
    }
  }

  // ---------------- ADD EXPENSE ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/expenses", formData);
      setFormData({ title: "", amount: "", category: "" });

      fetchExpenses();   // refresh expenses
      fetchSummary();    // refresh summary
      fetchAlert();     // refresh alert
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- DELETE EXPENSE ----------------
  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();   // refresh expenses
      fetchSummary();    // refresh summary
      fetchAlert();     // refresh alert
    } catch (error) {
      console.log(error);
    }
  };

  //------------logout----------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    fetchExpenses();
    fetchSummary();
    fetchAlert();
  }, []);

  return (
    

    <div className="min-h-screen bg-green-100 p-6">

       <div className="flex justify-end mb-4">
      <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Logout</button>
     </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-bold mb-2">Monthly Summary</h2>
        <p className="text-gray-700">{summary}</p>
      </div>

      {/*alert*/}
      {alert && (
        <div className="bg-red-100 border border-red-500 text-red-700 p-4 rounded-lg mb-6 ">{alert}</div>
      )}

        {/* Expense Chart */}
        <ExpenseChart expenses={expenses}/>

      {/* Add Expense Form */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Add Expense</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Add Expense
          </button>
        </form>
      </div>

      {/* Expense Table */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Your Expenses</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Category</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{expense.title}</td>
                <td className="p-2">{expense.amount}</td>
                <td className="p-2">{expense.category}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Dashboard;