"use client"
import { useState, useEffect } from "react";
import { BsPencil, BsFillTrash3Fill } from "react-icons/bs";
import { Modal, Button } from "react-bootstrap";
import AddUserModal from "@/components/AddRoleModal";
import EditUserModal from "@/components/EditUserModal"; // Add the Edit Modal here

export default function RoleManagement() {
  const [showAddNew, setShowAddNew] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    const res = await fetch("/api/userroles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchUsers();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Active Roles</h5>
        <button
          className="btn btn-outline-danger px-5"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() => setShowAddNew(true)}
        >
          Add New
        </button>
      </div>

      <AddUserModal show={showAddNew} handleClose={() => setShowAddNew(false)} fetchUsers={fetchUsers} />

      <div className="table-responsive bg-white py-3 rounded-4">
        <table className="table tablespace text-center">
          <thead className="align-items-center thead-bg">
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Password</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody className="text-grayer tbody-bg">
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={user._id}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>******</td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-sm"
                      title="Edit"
                      onClick={() => {
                        setEditingUser(user);
                      }}
                    >
                      <BsPencil />
                    </button>
                    <button
                      className="btn btn-sm"
                      title="Delete"
                      onClick={() => {
                        setSelectedId(user._id);
                        setConfirmDelete(true);
                      }}
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

      <EditUserModal
        show={editingUser !== null}
        handleClose={() => setEditingUser(null)}
        user={editingUser}

        fetchUsers={fetchUsers}
      />

      <Modal show={confirmDelete} onHide={() => setConfirmDelete(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDelete(selectedId);
              setConfirmDelete(false);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
