import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { showSuccess, showError } from "@/components/ToastAlert";

const AddPaymentModal = ({ show, handleClose, refreshTransactions }) => {
    const [paymentData, setPaymentData] = useState({
        userId: "",
        name: "",
        amount: "",
        date: "",
        source: "",
        status: "Pending",
    });

    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
    };

    // Add new payment
    const addPayment = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to add payment");

            showSuccess("Payment Added Successfully!");
            setPaymentData({ userId: "", name: "", amount: "", date: "", source: "", status: "Pending" }); // Reset form
            refreshTransactions();
            handleClose();
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>Add New Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>User ID</Form.Label>
                            <Form.Control type="text" name="userId" value={paymentData.userId} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={paymentData.name} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="number" name="amount" value={paymentData.amount} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" name="date" value={paymentData.date} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Source</Form.Label>
                            <Form.Control type="text" name="source" value={paymentData.source} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Status</Form.Label>
                            <Form.Select name="status" value={paymentData.status} onChange={handleChange}>
                                <option value="Pending">Pending</option>
                                <option value="In Review">In Review</option>
                                <option value="Completed">Completed</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="d-grid pt-3">
                            <Button variant="danger" type="button" onClick={addPayment} disabled={loading}>
                                {loading ? "Saving..." : "Save Payment"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddPaymentModal;
