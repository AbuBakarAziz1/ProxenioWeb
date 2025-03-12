"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button, Form, Modal } from "react-bootstrap";

export default function MyProfile() {
    const { data: session, update } = useSession();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editProfile, setEditProfile] = useState({});


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
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [session]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`/api/updateUserProfile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editProfile),
            });

            if (!response.ok) throw new Error("Failed to update profile");

            const data = await response.json();
            setProfile(data.user);
            setShowModal(false); // Close modal after success
        } catch (err) {
            setError(err.message);
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
                                        <Form.Control type="text" name="travelInterest" value={editProfile.travelInterest?.join(", ") || ""} onChange={handleInputChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Hobbies & Interests</Form.Label>
                                        <Form.Control type="text" name="hobbiesInterest" value={editProfile.hobbiesInterest?.join(", ") || ""} onChange={handleInputChange} />
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
                        <a className="color-maroon fw-semibold" href="#">Edit</a>
                    </div>

                    <div className="px-2 rounded-4">
                        {profile.videoIntroduction && (
                            <video width="100%" height="240" className="rounded-4" controls>
                                <source src={profile.videoIntroduction} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
