"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsPencil, BsFillTrash3Fill } from "react-icons/bs";
import { Modal, Button, Form } from "react-bootstrap";
import { showSuccess, showError } from "@/components/ToastAlert";


export default function UserTable() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [status, setStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUserList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
    setStatus(user?.status || "");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedUser(null);
  };

  const handleStatusChange = async () => {
    try {
      const response = await fetch(`/api/updateUserStatus/${selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      showSuccess("User Status Updated");
      if (data.success) {
        setUserList(prevUsers => prevUsers.map(user => user._id === selectedUser._id ? { ...user, status } : user));
        closeModal();
      }
    } catch (error) {
      showError("Error while Updating");
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/users/${selectedUser._id}`, { method: "DELETE" });
      setUserList(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
      closeModal();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="table-responsive bg-white p-3 rounded-4">
          <table className="table tablespace text-center">
            <thead className="thead-bg">
              <tr>
                <th></th>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-grayer tbody-bg">
              {userList.length > 0 ? userList.map((user, index) => (
                <tr key={user._id || index}>
                  <td><input type="checkbox" className="form-check-input" /></td>
                  <td>{index + 1}</td>
                  <td>
                    <Image
                      src={user.profilePicture?.trim() ? user.profilePicture : "/assets/img/user.png"}
                      width={50}
                      height={50}
                      className="rounded-circle border border-secondary object-fit-cover"
                      alt={user.username || "User"}
                    />
                  </td>
                  <td>
                    <span className="color-maroon cursor-pointer" onClick={() => router.push(`/admin/users/details/${user._id}`)}>
                      {user.fullName}
                    </span>
                  </td>
                  <td>{user.country}</td>
                  <td>{user.phone}</td>
                  <td>
                    <button className={`btn rounded-pill text-capitalize ${user.status === "active" ? "bg-green-btn" : "bg-light-btn"}`}>
                      {user.status}
                    </button>
                  </td>
                  <td className="text-center align-middle">
                    <div className="d-flex justify-content-center gap-1">
                      <button className="btn btn-sm" title="Edit" onClick={() => openModal("edit", user)}>
                        <BsPencil />
                      </button>
                      <button className="btn btn-sm" title="Delete" onClick={() => openModal("delete", user)}>
                        <BsFillTrash3Fill className="text-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="text-center">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal show={modalType !== null} onHide={closeModal} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>{modalType === "edit" ? "Edit User Status" : "Confirm Delete"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "delete" ? (
            <p>Are you sure you want to delete this user?</p>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          {modalType === "delete" ? (
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          ) : (
            <Button variant="danger" onClick={handleStatusChange}>Save Changes</Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
