import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Pill, Wrench } from "lucide-react";

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    // Load expenses from localStorage
    const savedExpenses = localStorage.getItem("coop-expenses");
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      category: "general",
    };

    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    localStorage.setItem("coop-expenses", JSON.stringify(updatedExpenses));

    // Reset form
    setDescription("");
    setAmount("");
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const getCategoryIcon = (description: string) => {
    const lower = description.toLowerCase();
    if (lower.includes("feed") || lower.includes("food")) return ShoppingCart;
    if (lower.includes("medicine") || lower.includes("vitamin") || lower.includes("health")) return Pill;
    if (lower.includes("repair") || lower.includes("tool") || lower.includes("maintenance")) return Wrench;
    return ShoppingCart;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-coop-brown">Expenses</h2>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Spent</div>
          <div className="text-xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-coop-brown mb-4">Add New Expense</h3>
        <form onSubmit={addExpense} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              placeholder="e.g., Chicken feed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full coop-brown font-semibold py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors flex items-center justify-center"
          >
            <Plus className="mr-2" size={16} />
            Add Expense
          </button>
        </form>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {expenses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-500">No expenses recorded yet</p>
          </div>
        ) : (
          expenses.map((expense) => {
            const IconComponent = getCategoryIcon(expense.description);
            return (
              <div key={expense.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <IconComponent className="text-red-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-coop-brown">{expense.description}</h4>
                    <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">${expense.amount.toFixed(2)}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-coop-brown mb-4">This Month</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-coop-brown">${monthlyTotal.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-coop-brown">{monthlyExpenses.length}</div>
            <div className="text-sm text-gray-600">Transactions</div>
          </div>
        </div>
      </div>
    </div>
  );
}
