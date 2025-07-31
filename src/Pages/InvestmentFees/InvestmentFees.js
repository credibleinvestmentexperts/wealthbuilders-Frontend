// InvestmentFees.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./InvestmentFees.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const InvestmentFees = () => {
  const { id } = useParams();
  const [hasFees, setHasFees] = useState("false");
  const [operation, setOperation] = useState("add");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}api/users/getUser`, {
          withCredentials: true,
        });
        setHasFees(res.data.hasFees ? "true" : "false");
      } catch (err) {
        toast.error("Failed to load user data");
      }
    };
    fetchUser();
  }, [id]);

  const handleToggleFees = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${BACKEND_URL}api/users/fees-toggle/${id}`,
        { hasFees },
        { withCredentials: true }
      );
      toast.success(`Fees status updated to ${hasFees}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Toggle failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustFees = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${BACKEND_URL}api/users/update-fees/${id}`,
        {
          operation,
          amount: Number(amount),
        },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Fees updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update fees");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="investment-fees-container">
      <ToastContainer />
      <h2>Investment Fees Manager</h2>

      {/* Section 1 */}
      <div className="section">
        <h3>Toggle Fees Visibility</h3>
        <label>Set Fees Status (true or false):</label>
        <select
          value={hasFees}
          onChange={(e) => setHasFees(e.target.value)}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button
          onClick={handleToggleFees}
          disabled={loading}
          className="toggle-btn"
        >
          {loading ? "Updating..." : "Save Toggle"}
        </button>
      </div>

      {/* Section 2 */}
      {hasFees === "true" && (
        <div className="section">
          <h3>Adjust User Fees</h3>
          <label>Operation:</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
          >
            <option value="add">Add</option>
            <option value="deduct">Deduct</option>
          </select>

          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />

          <button
            onClick={handleAdjustFees}
            disabled={loading}
            className="fee-btn"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}
    </div>
  );
};

export default InvestmentFees;