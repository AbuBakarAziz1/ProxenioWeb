"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { showSuccess, showError } from "@/components/ToastAlert";

export default function Settings() {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { oldPassword, newPassword, confirmPassword } = formData;
        const userId = session?.user?.id; // Get user ID from session

        if (!userId) return showError("You must be logged in to change your password.");
        if (!oldPassword || !newPassword || !confirmPassword) return showError("All fields are required.");
        if (newPassword !== confirmPassword) return showError("New passwords do not match.");

        setLoading(true);

        try {
            const response = await fetch("/api/auth/changePassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, oldPassword, newPassword })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Password change failed.");

            showSuccess("Password updated successfully!");
            setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            showError(err.message);
        }

        setLoading(false);
    };

    return (
        <div className=" px-1">

<h5 className="mb-2">Contact Admin</h5>
<div className="card shadow-sm border-0 bg-fff p-3 rounded-4 mb-3">
  <div className="card-body px-0 d-flex align-items-center">
    <i className="bi bi-envelope-fill text-danger fs-4 me-3"></i>
    <div>
      <h6 className="mb-1">Need Help?</h6>
      <p className="mb-0 text-muted">
        Reach out to the admin for support or inquiries.
        <br />
        <strong>Email:</strong> <a href="mailto:admin@example.com">admin@example.com</a><br />
        <strong>Phone:</strong> <a href="tel:+1234567890">+1 (234) 567-890</a>
      </p>
    </div>
    <a href="mailto:admin@example.com" className="btn btn-danger ms-auto">
      Contact Admin
    </a>
  </div>
</div>


            <h5 className="mt-2 pt-2">Change Password</h5>
            <div className="card shadow-sm border-0 bg-fff p-3 rounded-4">
                <div className="card-body px-0">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Old Password <span className="text-danger">*</span></label>
                            <input
                                type="password"
                                name="oldPassword"
                                className="form-control py-2 border-0"
                                placeholder="Enter old password"
                                value={formData.oldPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">New Password <span className="text-danger">*</span></label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="form-control py-2 border-0"
                                    placeholder="Enter new password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Re-enter Password <span className="text-danger">*</span></label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-control py-2 border-0"
                                    placeholder="Re-enter password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="text-end pt-3">
                            <button type="submit" className="btn btn-danger px-5" disabled={loading}>
                                {loading ? "Saving..." : "Save Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
