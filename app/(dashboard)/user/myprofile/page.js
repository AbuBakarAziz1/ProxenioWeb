"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button, Form, Modal } from "react-bootstrap";
import { showSuccess, showError } from "@/components/ToastAlert";
import { useDropzone } from "react-dropzone";
import { put } from "@vercel/blob";

export default function MyProfile() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedVideoUrl, setUploadedVideoUrl] = useState("");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editProfile, setEditProfile] = useState({
        fullName: "",
        gender: "",
        age: "",
        phone: "",
        country: "",
        religion: "",
        education: "",
        travelInterest: [],  // Ensure array type
        hobbiesInterest: [], // Ensure array type
        aboutMe: "",
    });

    useEffect(() => {
        if (!session?.user) {
            setLoading(false);
            return;
        }

        async function fetchProfile() {
            try {
                const response = await fetch(`/api/getUserProfile?email=${session.user.email}`);
                if (!response.ok) throw new Error("Failed to fetch profile data");
                const data = await response.json();
                setProfile(data.user);
                setEditProfile(data.user);
                setUploadedVideoUrl(data.user.videoIntroduction || ""); // Initialize uploadedVideoUrl
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [session]);

    const handleUpdate = async () => {
        try {
            const response = await fetch(`/api/update-user-profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editProfile),
            });
            if (!response.ok) throw new Error("Failed to update profile");

            const data = await response.json();
            setProfile(data.user);
            showSuccess("Successfully Updated");
            setShowModal(false); // Close modal after success
        } catch (err) {
            showError("Error While Update");
            setError(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setEditProfile((prev) => ({
            ...prev,
            [name]: name === "travelInterest" || name === "hobbiesInterest"
                ? value.split(",").map((item) => item.trim())  // Convert string to array
                : value
        }));
    };

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "video/*",
    });

    const handleVideoUpload = async () => {
        if (!file || !profile._id) return;

        const userId = profile._id;

        const maxSize = 20 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            showError("File size exceeds 50MB limit.");
            return;
        }

        setUploading(true);

        try {
            const extension = file.name.split(".").pop();
            const filename = `${userId}-${Date.now()}.${extension}`;

            // Upload directly to Vercel Blob
            const blob = await put(`videos/${filename}`, file, {
                access: "public",
                token: process.env.NEXT_PUBLIC_PROX_READ_WRITE_TOKEN,
            });
        


            if (!blob.url) throw new Error("File upload failed.");

            const response = await fetch("/api/upload-vercel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, videoUrl: blob.url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Upload failed");
            }

            setUploadedVideoUrl(data.videoUrl);
            showSuccess("Upload successful!");
            setFile(null);
            setPreviewUrl(null);
        } catch (error) {
            showError(error.message);
        } finally {
            setUploading(false);
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!profile) return <p>No profile data found.</p>;

    return (
        <div className="row">
            <div className="col-md-12">
                <h5 className="mb-3 px-1 fw-bold">My Profile</h5>

                {/* Personal Details Card */}
                <div className="card border-0 py-3 bg-lightgray rounded-3 mb-2 px-2">
                    <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                        <h5>Personal Details</h5>
                        <Button variant="link" className="color-maroon fw-semibold" onClick={() => setShowModal(true)}>
                            Edit
                        </Button>
                    </div>

                    <div className="table-responsive px-1 rounded-4">
                        <table className="table tablespace text-start table-light rounded-4">
                            <tbody className="text-grayer tbody-bg">
                                <tr>
                                    <td>Full Name</td>
                                    <td className="text-black">{profile.fullName}</td>
                                    <td>Gender</td>
                                    <td className="text-black">{profile.gender}</td>
                                </tr>
                                <tr>
                                    <td>Age</td>
                                    <td className="text-black">{profile.age}</td>
                                    <td>Phone Number</td>
                                    <td className="text-black">{profile.phone}</td>
                                </tr>
                                <tr>
                                    <td>Email Address</td>
                                    <td className="text-black">{profile.email}</td>
                                    <td>Country</td>
                                    <td className="text-black">{profile.country}</td>
                                </tr>
                                <tr>
                                    <td>Religion</td>
                                    <td className="text-black">{profile.religion}</td>
                                    <td>Education</td>
                                    <td className="text-black">{profile.education}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Profile Details Card */}
                <div className="card border-0 py-3 bg-lightgray rounded-3 mb-2 px-2">
                    <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                        <h5>Profile Details</h5>
                    </div>

                    <div className="table-responsive px-2 rounded-4">
                        <table className="table tablespace text-start table-light rounded-4">
                            <tbody className="text-grayer tbody-bg">
                                <tr>
                                    <td>About Me</td>
                                    <td className="text-black" colSpan="3">{profile.aboutMe}</td>
                                </tr>
                                <tr>
                                    <td>Travel Interests</td>
                                    <td className="text-black">{profile.travelInterest?.join(", ")}</td>
                                    <td>Hobbies & Interests</td>
                                    <td className="text-black">{profile.hobbiesInterest?.join(", ")}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit Profile Modal */}
                <Modal show={showModal} size="lg" onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton className="border-0">
                        <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <div className="row">
                                {/* Column 1 */}
                                <div className="col-lg-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control type="text" name="fullName" value={editProfile.fullName || ""} onChange={handleInputChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Gender</Form.Label>
                                        <Form.Control type="text" name="gender" value={editProfile.gender || ""} onChange={handleInputChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Age</Form.Label>
                                        <Form.Control type="number" name="age" value={editProfile.age || ""} onChange={handleInputChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control type="text" name="phone" value={editProfile.phone || ""} onChange={handleInputChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Control type="text" name="country" value={editProfile.country || ""} onChange={handleInputChange} />
                                    </Form.Group>
                                </div>

                                {/* Column 2 */}
                                <div className="col-lg-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Religion</Form.Label>
                                        <Form.Control type="text" name="religion" value={editProfile.religion || ""} onChange={handleInputChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Education</Form.Label>
                                        <Form.Control type="text" name="education" value={editProfile.education || ""} onChange={handleInputChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Travel Interests</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="travelInterest"
                                            value={Array.isArray(editProfile.travelInterest) ? editProfile.travelInterest.join(", ") : ""}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Hobbies & Interests</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="hobbiesInterest"
                                            value={Array.isArray(editProfile.hobbiesInterest) ? editProfile.hobbiesInterest.join(", ") : ""}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </div>

                                {/* Full Width Fields */}
                                <div className="col-12">
                                    <Form.Group className="mb-3">
                                        <Form.Label>About Me</Form.Label>
                                        <Form.Control as="textarea" rows={3} name="aboutMe" value={editProfile.aboutMe || ""} onChange={handleInputChange} />
                                    </Form.Group>
                                </div>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                        <Button variant="danger" onClick={handleUpdate}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Video Introduction Card */}
                <div className="card border-0 py-3 bg-lightgray rounded-3 px-2">
                    <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                        <h5>Video Introduction</h5>
                        <a className="color-maroon fw-semibold" href="#" onClick={() => setIsEditing(true)}>
                            Edit
                        </a>
                    </div>

                    {/* If Editing, Show Upload Area */}
                    {isEditing ? (
                        <div
                            {...getRootProps()}
                            className="dropzone card d-flex justify-content-center align-items-center bg-lightgray"
                            style={{ height: "240px", border: "2px dashed lightgray", cursor: "pointer" }}
                        >
                            <input {...getInputProps()} />
                            {previewUrl ? (
                                <video width="100%" height="240" className="rounded-4" controls>
                                    <source src={previewUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <p>Drag & drop a video here, or click to select one</p>
                            )}
                        </div>
                    ) : (
                        // Show Video if Available, Otherwise Show "No Video Uploaded"
                        <div className="px-2 rounded-4">
                            {uploadedVideoUrl ? (
                                <video width="100%" height="240" className="rounded-4" controls>
                                    <source src={uploadedVideoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="text-center py-3">
                                    <p>No video found</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Upload Button */}
                    {isEditing && (
                        <div className="text-center mt-3">
                            <button className="btn btn-danger align-end" onClick={handleVideoUpload} disabled={uploading}>
                                {uploading ? "Uploading..." : "Upload Video"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}