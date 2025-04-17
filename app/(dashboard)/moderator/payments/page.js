"use client";
import React, { useEffect, useState } from "react";
import AddPaymentModal from "@/components/AddPaymentModal";
import { BsFillTrash3Fill, BsPencil } from "react-icons/bs";
import { Modal, Button, Form } from "react-bootstrap";
import { showSuccess, showError } from "@/components/ToastAlert";

const EarningsDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    amount: "",
  });
  const [totals, setTotals] = useState({ totalEarnings: 0, pending: 0, inReview: 0 });
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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

  const openModal = (type, transaction = null) => {
    if (type === "add") {
      setShowModal(true);
      setModalType(null);
    } else {
      setModalType(type);
      setSelectedTransaction(transaction);
      if (type === "edit" && transaction) {
        setFormData({
          status: transaction.status || "",
          amount: transaction.amount || "",
        });
      }
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setSelectedTransaction(null);
    setFormData({ status: "", amount: "" });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/transactions/${selectedTransaction._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        showSuccess("Transaction updated successfully!");
        fetchTransactions();
        closeModal();
      } else {
        showError("Failed to update transaction.");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      showError("Something went wrong while updating.");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/transactions/${selectedTransaction._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showSuccess("Transaction deleted successfully!");
        fetchTransactions();
        closeModal();
      } else {
        showError("Failed to delete transaction.");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      showError("Something went wrong while deleting.");
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      const allIds = transactions.map((t) => t._id);
      setSelectedIds(allIds);
    }
    setSelectAll(!selectAll);
  };

  const deleteSelected = async () => {
    if (!selectedIds.length) return;

    try {
      const res = await fetch("/api/transactions/delete-multiple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess("Selected transactions deleted successfully!");
        fetchTransactions();
        setSelectedIds([]);
        setSelectAll(false);
      } else {
        showError(data.message || "Failed to delete selected transactions.");
      }
    } catch (error) {
      console.error("Error deleting selected transactions:", error);
      showError("Something went wrong while deleting multiple transactions.");
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
          <div className="d-flex gap-2">
            {selectedIds.length > 0 && (
              <button className="btn btn-danger" onClick={deleteSelected}>
                Delete Selected
              </button>
            )}
            <button className="btn btn-outline-danger px-5" onClick={() => openModal("add")}>
              Add New
            </button>
          </div>
        </div>

        <AddPaymentModal
          show={modalType === null && showModal}
          handleClose={closeModal}
          refreshTransactions={fetchTransactions}
        />

        <Modal show={modalType !== null && showModal} onHide={closeModal} centered>
          <Modal.Header closeButton className="border-0">
            <Modal.Title>
              {modalType === "edit" ? "Edit Transaction" : "Confirm Delete"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType === "delete" ? (
              <p>Are you sure you want to delete this transaction?</p>
            ) : (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Status</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleChange}>
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Completed">Completed</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter here"
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            {modalType === "delete" ? (
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            ) : (
              <Button variant="danger" onClick={handleSubmit}>
                Save Changes
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        <div className="col-md-12">
          <div className="table-responsive bg-fff p-3 rounded-4">
            <table className="table tablespace text-center">
              <thead className="align-items-center thead-bg">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody className="text-grayer tbody-bg">
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedIds.includes(transaction._id)}
                        onChange={() => handleSelect(transaction._id)}
                      />
                    </td>
                    <td>{transaction.userId}</td>
                    <td>{transaction.name}</td>
                    <td>${transaction.amount}</td>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.source}</td>
                    <td>{transaction.status}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          className="btn btn-sm"
                          title="Edit"
                          onClick={() => openModal("edit", transaction)}
                        >
                          <BsPencil />
                        </button>
                        <button
                          className="btn btn-sm"
                          title="Delete"
                          onClick={() => openModal("delete", transaction)}
                        >
                          <BsFillTrash3Fill className="text-danger" />
                        </button>
                      </div>
                    </td>
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
