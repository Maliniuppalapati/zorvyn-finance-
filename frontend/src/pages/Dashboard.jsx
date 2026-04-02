import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import SummaryCard from "../components/SummaryCard";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    type: "income",
    category: "",
    description: "",
  });

  // Role normalization to handle case sensitivity
  const rawRole = localStorage.getItem("role") || "Viewer";
  const role = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();
  const token = localStorage.getItem("token");

  // 🔄 Wrapped in useCallback to satisfy ESLint and prevent infinite loops
  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/finance/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  }, [token]);

  // Runs once on mount or when fetchData definition changes
  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/finance/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        amount: "",
        type: "income",
        category: "",
        description: "",
      });
      setShowForm(false);
      fetchData(); // Instantly refresh the dashboard cards
    } catch (err) {
      alert("Error: Only Admins can add transactions.");
    }
  };

  if (!data)
    return (
      <h1 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading Dashboard...
      </h1>
    );

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f4f7f6",
        minHeight: "100vh",
      }}
    >
      <h1>Finance Summary</h1>
      <p>
        Logged in as: <strong style={{ color: "#007bff" }}>{role}</strong>
      </p>

      {/* Summary Cards Section */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <SummaryCard
          title="Total Income"
          value={data.totalIncome}
          color="#28a745"
        />
        <SummaryCard
          title="Total Expenses"
          value={data.totalExpense}
          color="#dc3545"
        />
        <SummaryCard
          title="Net Balance"
          value={data.netBalance}
          color="#007bff"
        />
      </div>

      {/* 🛡️ ADMIN ONLY: Toggle Button */}
      {role === "Admin" ? (
        <button
          onClick={() => setShowForm(!showForm)}
          style={toggleButtonStyle}
        >
          {showForm ? "Close Form" : "+ Add New Transaction"}
        </button>
      ) : (
        <div style={viewerNoticeStyle}>
          ℹ️ <strong>Viewer Mode:</strong> You have read-only access to this
          dashboard.
        </div>
      )}

      {/* 📝 ADMIN ONLY: Transaction Form */}
      {showForm && role === "Admin" && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <h3>Add New Transaction</h3>
          <input
            type="number"
            placeholder="Amount"
            required
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            style={inputStyle}
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            style={inputStyle}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="text"
            placeholder="Category (e.g. Salary, Rent)"
            required
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            style={inputStyle}
          />
          <button type="submit" style={submitButtonStyle}>
            Save Record
          </button>
        </form>
      )}

      {/* Categories Breakdown Table */}
      <div style={breakdownCardStyle}>
        <h3>Categories Breakdown</h3>
        {data.categories.length > 0 ? (
          data.categories.map((c) => (
            <div key={c._id} style={listItemStyle}>
              <span>{c._id || "Uncategorized"}</span>
              <strong>${c.total.toLocaleString()}</strong>
            </div>
          ))
        ) : (
          <p>No transactions found for this period.</p>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};
const formStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "30px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};
const submitButtonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
const toggleButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#212529",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: "20px",
};
const viewerNoticeStyle = {
  marginBottom: "20px",
  padding: "15px",
  background: "#fff3cd",
  borderRadius: "8px",
  color: "#856404",
  border: "1px solid #ffeeba",
};
const breakdownCardStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};
const listItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #eee",
};

export default Dashboard;
