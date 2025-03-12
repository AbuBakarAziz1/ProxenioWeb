"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa";
import Image from "next/image";

const ProfileDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/getUserByid/${id}`);
                if (!response.ok) throw new Error("Failed to fetch profile");
                const data = await response.json();
                if (!data || !data.user) throw new Error("Invalid response structure");
                setProfile(data.user);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return <p className="text-center">Loading profile...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;
    if (!profile) return <p className="text-center text-muted">Profile not found.</p>;

    return (
        <div className="container px-1">
            <h5 className="mb-2 fw-bold cursor-pointer" onClick={() => router.back()} >
                Explore Profile {`>>`} Profile Details
            </h5>
            <div className="card shadow-sm border-0 bg-fff p-3 rounded-4">
                <div className="card-body px-0">
                    <div className="row">
                        {/* Profile Image */}
                        <div className="col-12 col-md-4">
                            <div
                                className="profile-card position-relative rounded-4 mb-4 shadow-md border overflow-hidden "
                                style={{ width: "100%", height: "300px" }}
                            >
                                <Image
                                    src={profile.profilePicture || "/assets/img/default-avatar.png"}
                                    alt={profile.username}
                                    width={100}
                                    height={100}
                                    onError={(e) => (e.target.src = "/assets/img/bg01.png")}
                                    className="img-fluid w-100 h-100"
                                    style={{ objectFit: "contain" }}
                                />
                                <div className="position-absolute bottom-0 end-0 p-3">
                                    <span className="badge bg-danger rounded-circle p-3 cursor-pointer">
                                        <FaHeart className="fs-28" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Profile Video */}
                        <div className="col-12 col-md-8 ">
                            {profile.videoIntroduction && (
                                <video
                                    width="100%"
                                    height="300px"
                                    className="rounded-4 w-100 border"
                                    controls
                                >
                                    <source src={profile.videoIntroduction} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="card border-0 py-3 bg-lightgray rounded-3 mb-2 px-2">
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
                                        <td>Country</td>
                                        <td className="text-black">{profile.country}</td>
                                    </tr>
                                    <tr>
                                        <td>Religion</td>
                                        <td className="text-black">{profile.religion}</td>
                                        <td>Education</td>
                                        <td className="text-black">{profile.education}</td>
                                    </tr>
                                    <tr>
                                        <td>Travel Interests</td>
                                        <td className="text-black">{profile.travelInterest?.join(", ") || "N/A"}</td>
                                        <td>Hobbies & Interests</td>
                                        <td className="text-black">{profile.hobbiesInterest?.join(", ") || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <td>About Me</td>
                                        <td className="text-black" colSpan={3}>
                                            {profile.aboutMe}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfileDetail;
