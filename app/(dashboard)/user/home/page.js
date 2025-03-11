"use client";

import { useState } from "react";
import { FaCheck } from "react-icons/fa"; // Import Tick Icon
import { useDropzone } from "react-dropzone";


const steps = ["Profile Creation", "Profile Details", "Video Introduction", "Review & Submit"]

export default function ProfileUpdate() {
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setError("");
  };

  const { currentUser } = useUser();
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
      setError("Please upload a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
  
    const requiredFields = [
      "fullName", "age", "phone", "gender", "profilePhoto", 
      "country", "education", "aboutMe"
    ];
    const emptyFields = requiredFields.filter(field => !formData[field]);
  
    if (emptyFields.length > 0) {
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
        body: formDataToSend, // Send as FormData
      });
  
      const data = await response.json();
      if (data.success) {
        alert("Profile updated successfully!");
      } else {
        alert(data.error || "Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };
  

  // const handleSubmit = async (e) => {

  //   console.log(formData);
  //   e.preventDefault();
  //   const requiredFields = ["fullName", "age", "phone", "gender", 
  //     "profilePhoto","country", "education", "aboutMe"];
  //   const emptyFields = requiredFields.filter(field => !formData[field]);
    
  //   if (emptyFields.length > 0) {
  //     setError(`Please fill in all required fields: missing * ${emptyFields.join(", ")}`);
  //     return;
  //   }
  //   const response = await fetch("/api/update-profile", {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: formDataToSend, 
  //     body: JSON.stringify({ userId: currentUser.id, ...formData }),
  //   });

  //   const data = await response.json();
  //   if (data.success) {
  //     alert("Profile updated successfully!");
  //   } else {
  //     alert("Error updating profile");
  //   }

  //   //console.log("Form submitted successfully", formData);
  // };

  return (
    <div className="container mt-5">
      <div className="card shadow border-0 p-4">

        <div className="d-flex flex-row justify-content-between align-items-center flex-wrap gap-2 mb-3 p-3 rounded-3 bg-lighter">
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

        <div className="mt-4 px-3">
          <form onSubmit={handleSubmit} >
            {step === 1 && <>
              <h4 className="mb-4 fw-medium">Profile Creation</h4>

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
                      <input type="email" name="email" className="form-control bg-lighter py-2 border-0 placeholder-light" placeholder="Enter email address" value={formData.email} readOnly/>
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
                        <option value="Religion 1">Religion 1</option>
                        <option value="Religion 2">Religion 2</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3 mt-1 row">
                    <label className="col-sm-4 col-form-label">Profession</label>
                    <div className="col-sm-8">
                      <select name="profession" className="form-select bg-lighter py-2 border-0 placeholder-light" value={formData.profession} onChange={handleChange} required>
                        <option value="" disabled hidden>Select Profession</option>
                        <option value="Profession 1">Profession 1</option>
                        <option value="Profession 2">Profession 2</option>
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
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
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
                        <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                        <option value="Master's Degree">Master&apos;s Degree</option>
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

              <h4 className="mb-4 medium">Profile Details</h4>

              <div className="row g-3">
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
                    <label className="col-sm-4 col-form-label ">Travel Interests <span className="text-danger">*</span></label>
                    <div className="col-sm-8">
                      <input type="text" name="travelInterest" className="form-control bg-lighter py-2 border-0 placeholder-light" placeholder="Enter travel interests" value={formData.travelInterest} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3 mt-1 row">
                    <label className="col-sm-4 col-form-label">Hobbies and Interests <span className="text-danger">*</span></label>
                    <div className="col-sm-8">
                      <input type="text" name="hobbiesInterest" className="form-control bg-lighter py-2 border-0 placeholder-light" placeholder="Enter hobbies and interests" value={formData.hobbiesInterest} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </div>

            </>
            }
            {step === 3 && <>

              <h4 className="mb-4 medium">Video Introduction</h4>

              <div className="row g-3">
                <div className="col-md-12">
                  {!formData.videoPreviewUrl && (
                    <div {...getVideoRootProps()} className="card d-flex justify-content-center align-items-center bg-lightgray" style={{ height: "400px", border: "2px dashed lightgray", cursor: "pointer" }}>
                      <input {...getVideoInputProps()} />
                      <i className="bi bi-cloud-upload" style={{ fontSize: "70px" }}></i>
                      <p className="fs-16 fw-semibold">Drag & drop a video here, or click to select a video</p>
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
                <div className="card border-0 py-4 bg-lightgray rounded-3 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2 px-3">
                    <h5>Personal Details</h5>
                    
                  </div>
                  <div className="table-responsive px-2 rounded-4">
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
                          <td className="text-black">{formData.email}</td>
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
                <div className="card border-0 py-4 bg-lightgray rounded-3 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2 px-3">
                    <h5>Profile Details</h5>
                    
                  </div>
                  <div className="table-responsive px-2 rounded-4">
                    <table className="table tablespace text-start table-light rounded-4">
                      <tbody className="text-grayer tbody-bg">
                        <tr>
                          <td>About Me</td>
                          <td className="text-black" colSpan="3">{formData.aboutMe}</td>
                        </tr>
                        <tr>
                          <td>Travel Interests</td>
                          <td className="text-black">{formData.travelInterests}</td>
                          <td>Hobbies & Interests</td>
                          <td className="text-black">{formData.hobbiesInterests}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Video Introduction Card */}
                <div className="card border-0 py-4 bg-lightgray rounded-3">
                  <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                    <h5>Video Introduction</h5>
                    
                  </div>
                  <div className="px-2 rounded-4">
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
            {error && <div className="alert alert-danger">{error}</div>}
        </div>



        <div className="d-flex justify-content-end gap-2 mt-4">
          {step > 1 && <div className="">
            <button type="button" className="btn btn-light px-5" onClick={prevStep}>Previous</button>
          </div>
          }
          {step < 4 ? (
            <button type="button" className="btn btn-danger px-5" onClick={nextStep}>Next</button>
          ) : (
            <button type="submit" className="btn btn-danger px-5" onClick={handleSubmit}>Review & Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}