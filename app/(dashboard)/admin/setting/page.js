"use client";
import { useState, useEffect } from "react";
import { BsPencil, BsFillTrash3Fill } from "react-icons/bs";
import { Modal, Button, Form } from "react-bootstrap";
import { showSuccess, showError } from "@/components/ToastAlert";

export default function SettingsPage() {
  const [settings, setSettings] = useState([]);
  const [modalType, setModalType] = useState(null); // 'add', 'edit', 'delete'
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [formData, setFormData] = useState({ transactionType: "", amount: "" });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      showError("Failed to fetch settings");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const method = modalType === "edit" ? "PUT" : "POST";
    const body = modalType === "edit" ? { id: selectedSetting._id, ...formData } : formData;

    try {
      const res = await fetch("/api/settings", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showSuccess(modalType === "edit" ? "Updated successfully" : "Added successfully");
        fetchSettings();
        closeModal();
      } else {
        showError("Operation failed");
      }
    } catch (error) {
      showError("Error processing request");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch("/api/settings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedSetting._id }),
      });

      if (res.ok) {
        showSuccess("Deleted successfully");
        fetchSettings();
        closeModal();
      } else {
        showError("Deletion failed");
      }
    } catch (error) {
      showError("Error deleting setting");
    }
  };

  const openModal = (type, setting = null) => {
    setModalType(type);
    setSelectedSetting(setting);
    setFormData(setting ? { transactionType: setting.transactionType, amount: setting.amount } : { transactionType: "", amount: "" });
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedSetting(null);
    setFormData({ transactionType: "", amount: "" });
  };

  return (
    <main className="container">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="bold">Your Charges List</h5>
        <button className="btn btn-outline-danger px-5" onClick={() => openModal("add")}>
          Add New
        </button>
      </div>

      <div className="table-responsive bg-white py-3 rounded-4 shadow-xs">
        <table className="table tablespace text-center">
          <thead className="thead-bg">
            <tr>
              <th className="text-start">Transaction Type</th>
              <th>Amount</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody className="tbody-bg">
            {settings.map((setting) => (
              <tr key={setting._id}>
                <td className="text-start">{setting.transactionType}</td>
                <td>${setting.amount}</td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-1">
                    <button className="btn btn-sm" title="Edit" onClick={() => openModal("edit", setting)}>
                      <BsPencil />
                    </button>
                    <button className="btn btn-sm" title="Delete" onClick={() => openModal("delete", setting)}>
                      <BsFillTrash3Fill className="text-danger" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

  
      <Modal show={modalType !== null} onHide={closeModal} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>{modalType === "add" ? "Add New" : modalType === "edit" ? "Edit Transaction" : "Confirm Delete"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "delete" ? (
            <p>Are you sure you want to delete this setting?</p>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Transaction Type</Form.Label>
                <Form.Control type="text" name="transactionType" value={formData.transactionType} onChange={handleChange} placeholder="Enter here" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Enter here" />
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
              {modalType === "edit" ? "Save Changes" : "Save"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </main>
  );
}
