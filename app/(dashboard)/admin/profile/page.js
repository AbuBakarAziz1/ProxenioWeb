"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsPencil } from "react-icons/bs";
import { showSuccess, showError } from "@/components/ToastAlert";
import { useSession } from "next-auth/react";
import { Modal, Button } from "react-bootstrap"; // Import React-Bootstrap Modal
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");  // State for fullName
  const [profilePicture, setProfilePicture] = useState(null);  // State for profilePicture
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal State
  const router = useRouter();

  const currentUser = session?.user || {};

  const handleUpdate = async () => {
    if (!password.trim()) return showError("Please enter a new password");

    const formData = new FormData();
    if (fullName) formData.append("fullName", fullName);
    if (profilePicture) formData.append("profilePicture", profilePicture);
    if (password) formData.append("password", password);

    try {
      const res = await fetch(`/api/auth/update-profile/${currentUser.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        showSuccess("Profile updated successfully");
        setPassword(""); // Clear password field
        setShowModal(false); // Close modal
      } else {
        showError(data.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showError("Profile update failed");
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card shadow-sm p-3 border-0">
          <div className="mb-3">
            <Image
              src={currentUser?.profilePicture || "/assets/img/user.png"}
              width={120}
              height={120}
              className="rounded-pill border m-2 "
              style={{borderRadius:"50%"}}
              alt="profile"
            />
            <div className="text-start ms-3">
              <h5 className="mb-0 text-black">
                {currentUser?.fullName || "Username"}
              </h5>
              <p className="mb-0 text-muted">
                {currentUser?.email || "No email available"}
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowModal(true); // Show confirmation modal
            }}
          >
            <div className="table-responsive p-2 rounded-4">
              <table className="table">
                <tbody>
                  <tr className="bg-lightgray align-middle">
                    <td className="bg-lightgray">Full Name</td>
                    <td className="text-black bg-lightgray">
                      <input
                        type="text"
                        className="form-control"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                      />
                    </td>
                  </tr>
                  <tr className="bg-lightgray align-middle">
                    <td className="bg-lightgray">Password</td>
                    <td className="text-black bg-lightgray">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="***********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr className="bg-lightgray align-middle">
                    <td className="bg-lightgray">Profile Picture</td>
                    <td className="text-black bg-lightgray">
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end align-middle">
                      <button type="submit" className="btn btn-md" title="View Update">
                        <BsPencil />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </form>
        </div>
      </div>

      {/* React-Bootstrap Modal for Confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Confirm Profile Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to update your profile?</p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleUpdate}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}