"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function MyProfile() {
    const { data: session, update } = useSession();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [session]);

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
                        <a className="color-maroon fw-semibold" href="#">Edit</a>
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
                        <a className="color-maroon fw-semibold" href="#">Edit</a>
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
