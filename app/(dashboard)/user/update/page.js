"use client"

import { useState } from "react";

export default function ProfileForm({ user }) {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    gender: user?.gender || "",
    age: user?.age || "",
    phone: user?.phone || "",
    country: user?.country || "",
    city: user?.city || "",
    state: user?.state || "",
    education: user?.education || "",
    profession: user?.profession || "",
    aboutMe: user?.aboutMe || "",
    travelInterest: user?.travelInterest?.join(", ") || "",
    hobbiesInterest: user?.hobbiesInterest?.join(", ") || "",
    profilePicture: user?.profilePicture || "",
    videoIntroduction: user?.videoIntroduction || "",
  });
  const { currentUser } = useUser();
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/update-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id, ...formData }),
    });

    const data = await response.json();
    if (data.success) {
      alert("Profile updated successfully!");
    } else {
      alert("Error updating profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Update Profile</h2>

      <label>Full Name</label>
      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

      <label>Gender</label>
      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <label>Age</label>
      <input type="number" name="age" value={formData.age} onChange={handleChange} />

      <label>Phone</label>
      <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

      <label>Country</label>
      <input type="text" name="country" value={formData.country} onChange={handleChange} />

      <label>State</label>
      <input type="text" name="state" value={formData.state} onChange={handleChange} />

      <label>City</label>
      <input type="text" name="city" value={formData.city} onChange={handleChange} />

      <label>Education</label>
      <input type="text" name="education" value={formData.education} onChange={handleChange} />

      <label>Profession</label>
      <input type="text" name="profession" value={formData.profession} onChange={handleChange} />

      <label>About Me</label>
      <textarea name="aboutMe" value={formData.aboutMe} onChange={handleChange} maxLength="500"></textarea>

      <label>Travel Interests (comma-separated)</label>
      <input type="text" name="travelInterest" value={formData.travelInterest} onChange={handleChange} />

      <label>Hobbies (comma-separated)</label>
      <input type="text" name="hobbiesInterest" value={formData.hobbiesInterest} onChange={handleChange} />

      <label>Profile Picture (URL)</label>
      <input type="text" name="profilePicture" value={formData.profilePicture} onChange={handleChange} />

      <label>Video Introduction (URL)</label>
      <input type="text" name="videoIntroduction" value={formData.videoIntroduction} onChange={handleChange} />

      <button type="submit">Update Profile</button>
    </form>
  );
}
