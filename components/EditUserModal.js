import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { showSuccess, showError } from "@/components/ToastAlert";

const EditUserModal = ({ show, handleClose, user, fetchUsers }) => {
    const [updatedUser, setUpdatedUser] = useState(user || {});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setUpdatedUser(user || {});
    }, [user]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!updatedUser?._id) {
            showError("Invalid user data");
            return;
        }
        setLoading(true);

        try {
            const res = await fetch("/api/userroles", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: updatedUser._id, // Ensure `id` is passed correctly
                    username: updatedUser.username,
                    role: updatedUser.role,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update user");

            handleClose();
            showSuccess("User Successfully Updated.")
            fetchUsers();
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton  className="border-0">
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={updatedUser.username || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Select name="role" value={updatedUser.role || ""} onChange={handleChange}>
                            <option value="admin">Admin</option>
                            <option value="moderator">Moderator</option>
                            <option value="user">User</option>
                        </Form.Select>
                    </Form.Group>

                    <div className="d-grid pt-3">
                        <Button variant="danger" onClick={handleSubmit} disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditUserModal;
