"use client";
import React, { useEffect, useState } from "react";
import AddPaymentModal from "@/components/AddPaymentModal";

const EarningsDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ totalEarnings: 0, pending: 0, inReview: 0 });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data.transactions);
      setTotals({
        totalEarnings: data.totalEarnings,
        pending: data.pending,
        inReview: data.inReview,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 mb-5">
          <div className="card bg-light border-0 shadow-sm p-4 rounded-5 border-bottom border-5 border-danger">
            <h5 className="mb-4 fs-4">Your Earnings</h5>
            <div className="row">
              <div className="col-4 col-md-2 text-muted fw-light">
                <p className="text-muted fw-light fs-12">
                  Total Earning <br />
                  <span className="color-maroon p-2 fs-16">${totals.totalEarnings}</span>
                </p>
              </div>
              <div className="col-4 col-md-2">
                <p className="text-muted fw-light fs-12">
                  Pending <br />
                  <span className="text-black p-2 fs-16">${totals.pending}</span>
                </p>
              </div>
              <div className="col-4 col-md-2">
                <p className="text-muted fw-light fs-12">
                  In Review <br />
                  <span className="text-black p-2 fs-16">${totals.inReview}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">

        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="fw-semibold fs-24">Transaction Details</h5>
          <button
            className="btn btn-outline-danger px-5"

            onClick={() => setShowModal(true)}
          >
            Add New
          </button>
        </div>

        {/* Add payment Modal */}
        <AddPaymentModal show={showModal} handleClose={() => setShowModal(false)} refreshTransactions={fetchTransactions} />


        <div className="col-md-12">
          <div className="table-responsive bg-fff p-3 rounded-4">
            <table className="table tablespace text-center">
              <thead className="align-items-center thead-bg">
                <tr>
                  <th></th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody className="text-grayer tbody-bg">
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      <input type="checkbox" className="form-check-input" />
                    </td>
                    <td>{transaction.userId}</td>
                    <td>{transaction.name}</td>
                    <td>${transaction.amount}</td>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsDashboard;
