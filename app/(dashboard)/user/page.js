"use client";
import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import { useSession } from "next-auth/react";
import { showSuccess, showError } from "@/components/ToastAlert";
import { useRouter } from "next/navigation";

const steps = ["Profile Creation", "Profile Details", "Video Introduction", "Review & Submit"]

export default function UserDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [error, setError] = useState("");
    const [userDetails, setUserDetails] = useState(null);
    const [step, setStep] = useState(1);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => {
        setStep((prev) => Math.max(prev - 1, 1));
        setError("");
    };

    const currentUser = session?.user || {};

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!session?.user?.email) return;

            try {
                const response = await fetch(`/api/getUserProfile?email=${session.user.email}`);
                if (!response.ok) throw new Error("Failed to fetch user details");

                const data = await response.json();
                setUserDetails(data.user);
            } catch (err) {
                setError(err.message);
            } finally {
                //setLoading(false);
            }
        };

        fetchUserDetails();
    }, [session]);

    const [formData, setFormData] = useState({
        fullName: "",
        age: "",
        email: "",
        city: "",
        religion: "",
        profession: "",
        gender: "",
        phone: "",
        country: "",
        state: "",
        education: "",
        profilePhoto: null,
        aboutMe: "",
        travelInterest: "",
        hobbiesInterest: "",
        videoFile: null,
        videoPreviewUrl: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleVideoDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith("video/")) {

            setFormData({ ...formData, videoFile: file, videoPreviewUrl: URL.createObjectURL(file) });
        } else {
            showError("Please upload a valid video file.");
            setError("Please upload a valid video file.");
        }
    };

    const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
        onDrop: handleVideoDrop, accept: "video/*"
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setFormData({ ...formData, profilePhoto: file });
        } else {
            showError("");
            setError("Please upload a valid image file.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requiredFields = [
            "fullName", "age", "phone", "gender", "profilePhoto",
            "country", "education", "aboutMe"
        ];
        const emptyFields = requiredFields.filter(field => !formData[field]);

        if (emptyFields.length > 0) {
            showError("Required fields are missing")
            setError(`Please fill in all required fields: missing * ${emptyFields.join(", ")}`);
            return;
        }
        // Create FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append("userId", currentUser.id);
        formDataToSend.append("fullName", formData.fullName);
        formDataToSend.append("age", formData.age);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("city", formData.city);
        formDataToSend.append("religion", formData.religion);
        formDataToSend.append("profession", formData.profession);
        formDataToSend.append("gender", formData.gender);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("country", formData.country);
        formDataToSend.append("state", formData.state);
        formDataToSend.append("education", formData.education);
        formDataToSend.append("aboutMe", formData.aboutMe);
        formDataToSend.append("travelInterest", formData.travelInterest);
        formDataToSend.append("hobbiesInterest", formData.hobbiesInterest);

        if (formData.profilePhoto) {
            formDataToSend.append("profilePhoto", formData.profilePhoto);
        }

        if (formData.videoFile) {
            formDataToSend.append("videoFile", formData.videoFile);
        }

        try {
            const response = await fetch("/api/update-profile", {
                method: "PUT",
                body: formDataToSend,
            });

            const data = await response.json();
            if (data.success) {
                showSuccess("Profile updated successfully!");
                // Reset the form fields
                setFormData({
                    fullName: "",
                    age: "",
                    email: "",
                    city: "",
                    religion: "",
                    profession: "",
                    gender: "",
                    phone: "",
                    country: "",
                    state: "",
                    education: "",
                    profilePhoto: null,
                    aboutMe: "",
                    travelInterest: "",
                    hobbiesInterest: "",
                    videoFile: null,
                    videoPreviewUrl: ""
                });

            } else {
                showError(data.error || "Error updating profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            showError("Error updating profile. Please try again.");
        }
    };

    useEffect(() => {
        if (!userDetails) return;

        const detailsFilled =
            userDetails.videoIntroduction &&
            userDetails.aboutMe &&
            userDetails.fullName &&
            userDetails.country;

        if (detailsFilled) {
            if (userDetails.status === "active") {
                router.push("/user/explore"); // Redirect to next page
            }
        }
    }, [userDetails, router]);


    if (status === "loading") {
        return <div>Loading...</div>; // Render after all hooks have run
    }

    const showVerificationMessage =
        !userDetails?.videoIntroduction ||
        !userDetails?.aboutMe ||
        !userDetails?.fullName ||
        !userDetails?.country;

    return (
        <div className="container px-2 mt-3">
            {!showVerificationMessage ? (
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <div className=" border-0 p-4 text-center">
                        <MdError className="color-maroon fs-25 my-3" fontSize={96} />
                        <h3 className="mb-3">Your account is not verified yet.</h3>
                        <p>Your account is under review, please wait. We will notify you once it’s approved by the admin.
                            <br /> Thanks for your patience.</p>
                    </div>
                </div>
            ) : (
                <div className="card shadow-sm border-0 p-3">

                    <div className="d-flex flex-row justify-content-between align-items-center flex-wrap gap-2 mb-3 py-3 px-1 rounded-3 bg-lighter">
                        {steps.map(
                            (title, index) => (
                                <div key={index} className="d-flex gap-2 align-items-center">
                                    <div className={`step ${step === index + 1 ? "active" : ""} ${step > index + 1 ? "completed" : ""}`}>
                                        {step > index + 1 ? <FaCheck size={14} /> : index + 1}
                                    </div>
                                    <div className="color-maroon fw-medium">{title}</div>
                                </div>
                            )
                        )}
                    </div>

                    <div className="mt-2 px-2">
                        <form onSubmit={handleSubmit} >
                            {step === 1 && <>
                                <h4 className="mb-3 fw-medium">Profile Creation</h4>

                                <div className="row g-3">
                                    {/* Left Column */}
                                    <div className="col-md-6">
                                        <div className="mb-3 mt-1 row">
                                            <label className="col-sm-4 col-form-label">Full Name <span className="text-danger">*</span></label>
                                            <div className="col-sm-8">
                                                <input type="text" name="fullName" className="form-control bg-lighter py-2 border-0 placeholder-light" placeholder="Enter full name" value={formData.fullName} onChange={handleChange} />
                                            </div>
                                        </div>

                                        <div className="mb-3 mt-1 row">
                                            <label className="col-sm-4 col-form-label">Age <span className="text-danger">*</span></label>
                                            <div className="col-sm-8">
                                                <input type="number" name="age" className="form-control bg-lighter py-2 border-0 placeholder-light" placeholder="Enter age" value={formData.age} onChange={handleChange} />
                                            </div>
                                        </div>

                                        <div className="mb-3 mt-1 row">
                                            <label className="col-sm-4 col-form-label">Email Address <span className="text-danger"></span></label>
                                            <div className="col-sm-8">
                                                <input type="email" name="email" className="form-control bg-lighter py-2 border-0 placeholder-light" placeholder="Enter email address" value={currentUser.email} readOnly disabled />
                                            </div>
                                        </div>

                                        <div className="mb-3 mt-1 row">
                                            <label className="col-sm-4 col-form-label">City <span className="text-danger">*</span></label>
                                            <div className="col-sm-8">
                                                <input type="text" name="city" className="form-control bg-lighter py-2 border-0 placeholder-light" placeholder="Enter city" value={formData.city} onChange={handleChange} />
                                            </div>
                                        </div>

                                        <div className="mb-3 mt-1 row">
                                            <label className="col-sm-4 col-form-label">Religion</label>
                                            <div className="col-sm-8">
                                                <select name="religion" className="form-select bg-lighter py-2 border-0 placeholder-light" value={formData.religion} onChange={handleChange} required>
                                                    <option value="" disabled hidden>Select Religion</option>
                                                    <option value="Islam">Islam</option>
                                                    <option value="Christianity">Christianity</option>
                                                    <option value="Hinduism">Hinduism</option>
                                                    <option value="Buddhism">Buddhism</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-3 mt-1 row">
                                            <label className="col-sm-4 col-form-label">Profession</label>
                                            <div className="col-sm-8">
                                                <select name="profession" className="form-select bg-lighter py-2 border-0 placeholder-light" value={formData.profession} onChange={handleChange} required>
                                                    <option value="" disabled hidden>Select Profession</option>
                                                    <option value="Web Developer">Web Developer</option>
                                                    <option value="Software Engineer">Software Engineer</option>
                                                    <option value="Doctor">Doctor</option>
                                                    <option value="Teacher">Teacher</option>
                                                    <option value="Business Owner">Business Owner</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="col-md-6">
                                        <div className="mb-3 mt-1 row">
                                            <label className="col-sm-4 col-form-label">Gender <span className="text-danger">*</span></label>
                                            <div className="col-sm-8">
                                                <select name="gender" className="form-select bg-lighter py-2 border-0 placeholder-light" value={formData.gender} onChange={handleChange} required>
                                                    <option value="" disabled hidden>Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-3 mt-1 row">
                                            <label className="col-sm-4 col-form-label">Phone Number <span className="text-danger">*</span></label>
                                            <div className="col-sm-8">
                                                <input type="text" name="phone" className="form-control bg-lighter py-2 border-0 placeholder-light" placeholder="Enter phone number" value={formData.phone} onChange={handleChange} />
                                            </div>
                                        </div>

                                        <div className="mb-3 mt-1 row">
                                            <label className="col-sm-4 col-form-label">Country <span className="text-danger">*</span></label>
                                            <div className="col-sm-8">
                                                <input type="text" name="country" className="form-control bg-lighter py-2 border-0 placeholder-light" placeholder="Enter country" value={formData.country} onChange={handleChange} />
                                            </div>
                                        </div>

                                        <div className="mb-3 mt-1 row">
                                            <label className="col-sm-4 col-form-label">State/Province <span className="text-danger">*</span></label>
                                            <div className="col-sm-8">
                                                <input type="text" name="state" className="form-control bg-lighter py-2 border-0 placeholder-light" placeholder="Enter state or province" value={formData.state} onChange={handleChange} />
                                            </div>
                                        </div>

                                        <div className="mb-3 mt-1 row">
                                            <label className="col-sm-4 col-form-label">Education</label>
                                            <div className="col-sm-8">
                                                <select name="education" className="form-select bg-lighter py-2 border-0 placeholder-light" value={formData.education} onChange={handleChange} required>
                                                    <option value="" disabled hidden>Select Education Level</option>
                                                    <option value="High School">High School</option>
                                                    <option value="Associate Degree">Associate Degree</option>
                                                    <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                                                    <option value="Master's Degree">Master&apos;s Degree</option>
                                                    <option value="PhD">PhD</option>
                                                    <option value="Diploma">Diploma</option>
                                                    <option value="Others">Others</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-3 mt-1 row">
                                            <label className="col-sm-4 col-form-label">Profile Photo <span className="text-danger">*</span></label>
                                            <div className="col-sm-8">
                                                <input type="file" name="profilePhoto" className="form-control bg-lighter py-2 border-0 placeholder-light" onChange={handleFileChange} />
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </>}
                            {step === 2 && <>

                                <h4 className="mb-3 medium">Profile Details</h4>

                                <div className="row g-2">
                                    <div className="col-md-12">
                                        <div className="mb-3 mt-1 row">
                                            <label className="col-sm-2 col-form-label">About Me <span className="text-danger">*</span></label>
                                            <div className="col-sm-10">
                                                <textarea name="aboutMe" className="form-control bg-lighter border-0 py-2 placeholder-light" rows="4" placeholder="Enter about yourself" value={formData.aboutMe} onChange={handleChange}></textarea>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="col-md-6">
                                        <div className="mb-3 mt-1 row">
                                            <label className="col-sm-4 col-form-label ">Travel Interests (separate with commas)<span className="text-danger">*</span></label>
                                            <div className="col-sm-8">
                                                <input type="text" name="travelInterest" className="form-control bg-lighter py-2 border-0 placeholder-light" placeholder="Enter travel interests (separate with commas)" value={formData.travelInterest} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3 mt-1 row">
                                            <label className="col-sm-4 col-form-label">Hobbies and Interests (separate with commas)<span className="text-danger">*</span></label>
                                            <div className="col-sm-8">
                                                <input type="text" name="hobbiesInterest" className="form-control bg-lighter py-2 border-0 placeholder-light" placeholder="Enter hobbies and interests (separate with commas)" value={formData.hobbiesInterest} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </>
                            }
                            {step === 3 && <>

                                <h4 className="mb-4 medium">Video Introduction</h4>

                                <div className="row g-2">
                                    <div className="col-md-12">
                                        {!formData.videoPreviewUrl && (
                                            <div {...getVideoRootProps()} className="card d-flex justify-content-center align-items-center bg-lightgray" style={{ height: "400px", border: "2px dashed lightgray", cursor: "pointer" }}>
                                                <input {...getVideoInputProps()} />
                                                <i className="bi bi-cloud-upload" style={{ fontSize: "70px" }}></i>
                                                <p className="fs-16 fw-semibold px-4 text-center">Drag & drop a video here, or click to select a video</p>
                                            </div>
                                        )}
                                        {formData.videoPreviewUrl && (
                                            <div className="text-center">
                                                <video controls src={formData.videoPreviewUrl} className="img-fluid" style={{ maxHeight: "360px" }} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </>}
                            {step === 4 && <>
                                <h4 className="mb-4 medium">Review and Submit</h4>
                                <div>
                                    {/* Personal Details Card */}
                                    <div className="card border-0 py-3 px-1 bg-lightgray rounded-3 mb-2">
                                        <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                                            <h5>Personal Details</h5>

                                        </div>
                                        <div className="table-responsive px-1 rounded-4">
                                            <table className="table tablespace text-start table-light rounded-4">
                                                <tbody className="text-grayer tbody-bg">
                                                    <tr>
                                                        <td>Full Name</td>
                                                        <td className="text-black">{formData.fullName}</td>
                                                        <td>Gender</td>
                                                        <td className="text-black">{formData.gender}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Age</td>
                                                        <td className="text-black">{formData.age}</td>
                                                        <td>Phone Number</td>
                                                        <td className="text-black">{formData.phone}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Email Address</td>
                                                        <td className="text-black">{currentUser.email}</td>
                                                        <td>Country</td>
                                                        <td className="text-black">{formData.country}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Religion</td>
                                                        <td className="text-black">{formData.religion}</td>
                                                        <td>Education</td>
                                                        <td className="text-black">{formData.education}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Profile Details Card */}
                                    <div className="card border-0 py-3 px-1 bg-lightgray rounded-3 mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                                            <h5>Profile Details</h5>

                                        </div>
                                        <div className="table-responsive px-1 rounded-4">
                                            <table className="table tablespace text-start table-light rounded-4">
                                                <tbody className="text-grayer tbody-bg">
                                                    <tr>
                                                        <td>About Me</td>
                                                        <td className="text-black" colSpan="3">{formData.aboutMe}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Travel Interests</td>
                                                        <td className="text-black">{formData.travelInterest}</td>
                                                        <td>Hobbies & Interests</td>
                                                        <td className="text-black">{formData.hobbiesInterest}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Video Introduction Card */}
                                    <div className="card border-0 py-3 px-1 bg-lightgray rounded-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                                            <h5>Video Introduction</h5>

                                        </div>
                                        <div className="px-1 rounded-4">
                                            {formData.videoPreviewUrl && (
                                                <video width="100%" height="240" className="rounded-4" controls>
                                                    <source src={formData.videoPreviewUrl} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>}
                        </form>
                        {error && <div className="alert alert-danger my-2">{error}</div>}
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4 mb-1">
                        {step > 1 && <div className="">
                            <button type="button" className="btn btn-light px-5" onClick={prevStep}>Previous</button>
                        </div>}
                        {step < 4 ? (
                            <button type="button" className="btn btn-danger px-5" onClick={nextStep}>Next</button>
                        ) : (
                            <button type="submit" className="btn btn-danger px-5" onClick={handleSubmit}>Review & Submit</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}