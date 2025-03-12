"use client";
import { useState, useEffect, useMemo } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { showSuccess, showError } from "@/components/ToastAlert";
import Link from "next/link";
import Image from "next/image";

const ProfilePage = () => {
  const { data: session } = useSession();
  const currentUser = session?.user; // Get user from session
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    gender: "",
    ageRange: "",
    country: "",
    religion: "",
    education: "",
    profession: "",
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("/api/getAllUsers");
        if (!response.ok) throw new Error("Failed to fetch profiles");
        const data = await response.json();

        const filtered = data.filter(user => user._id !== currentUser?.id && user.status === "active");
        setProfiles(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [currentUser?.id]);

  const handleChange = (e) => setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const filteredProfiles = useMemo(() => {
    return profiles.filter(({ gender, country, religion, education, profession, age }) => {
      const lowerCaseFilters = Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, value.toLowerCase()])
      );

      return (
        (!filters.gender ||
          (lowerCaseFilters.gender === gender?.toLowerCase()) ||
          (lowerCaseFilters.gender === "others" &&
            gender?.toLowerCase() !== "male" &&
            gender?.toLowerCase() !== "female")) &&
        (!filters.country ||
          (lowerCaseFilters.country === country?.toLowerCase()) ||
          (lowerCaseFilters.country === "others" &&
            country?.toLowerCase() !== "new york" &&
            country?.toLowerCase() !== "los angeles" &&
            country?.toLowerCase() !== "chicago")) &&
        (!filters.religion ||
          (lowerCaseFilters.religion === religion?.toLowerCase()) ||
          (lowerCaseFilters.religion === "others" &&
            religion?.toLowerCase() !== "christianity" &&
            religion?.toLowerCase() !== "islam" &&
            religion?.toLowerCase() !== "hinduism" &&
            religion?.toLowerCase() !== "atheism")) &&
        (!filters.education ||
          (lowerCaseFilters.education === education?.toLowerCase()) ||
          (lowerCaseFilters.education === "others" &&
            education?.toLowerCase() !== "high school" &&
            education?.toLowerCase() !== "bachelor's degree" &&
            education?.toLowerCase() !== "master's degree")) &&
        (!filters.profession ||
          (lowerCaseFilters.profession === profession?.toLowerCase()) ||
          (lowerCaseFilters.profession === "others" &&
            profession?.toLowerCase() !== "engineer" &&
            profession?.toLowerCase() !== "doctor" &&
            profession?.toLowerCase() !== "artist" &&
            profession?.toLowerCase() !== "entrepreneur" &&
            profession?.toLowerCase() !== "architect")) &&
        (!filters.ageRange ||
          (filters.ageRange === "18-25" && age >= 18 && age <= 25) ||
          (filters.ageRange === "26-35" && age >= 26 && age <= 35) ||
          (filters.ageRange === "36-45" && age >= 36 && age <= 45) ||
          (filters.ageRange === "46+" && age >= 46))
      );
    });
  }, [profiles, filters]);

  const handleMatch = async (receiverId) => {
    if (!currentUser) return showError("You need to log in to match profiles.");
    try {
      const response = await fetch("/api/userMatches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: currentUser.id, receiverId }),
      });

      const data = await response.json();
      if (response.ok) {
        showSuccess("Match created successfully!");
      } else {
        showError(data.message || "Error creating match");
      }
    } catch (error) {
      showError("Unknown Error..!");
      console.error("Error:", error);
    }
  };

  if (loading) return <p className="text-center">Loading profiles...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container">
      <div className="row flex-column-reverse flex-md-row">
        <div className="col-12 col-md-8">
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map(({ _id, profilePicture, username, fullName, aboutMe, country, religion, status }) => (

              <div
                key={_id}
                className="profile-card position-relative rounded-3 mb-4 border-0 shadow-sm overflow-hidden"
                style={{ width: "100%", height: "400px" }}
              >
                {profilePicture ? (
                  <Image
                    src={profilePicture}
                    alt={username}
                    onError={(e) => (e.target.src = "/assets/img/bg01.png")}
                    className="img-fluid"
                    width={100}
                    height={100}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                ) : (
                  <Image
                    src="/assets/img/bg01.png"
                    alt="default"
                    className="img-fluid"
                    width={100}
                    height={100}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                )}

                <Link key={_id} href={`/user/explore/details/${_id}`} passHref>
                  <div className="profile-card-overlay position-absolute bottom-0 start-0 w-100 p-3">
                    <h5 className="text-white mb-1">{fullName}</h5>
                    <p className="text-white small">{aboutMe}</p>
                    <div className="d-flex items-center gap-2">
                      <span className="badge opacity-75 rounded-pill text-bg-light px-3 py-2">
                        <FaLocationDot /> {country}
                      </span>
                      <span className="badge opacity-75 rounded-pill text-bg-light px-3 py-2">{religion}</span>
                    </div>
                  </div>
                </Link>

                {/* Heart Button */}
                <div className="position-absolute bottom-0 end-0 p-3">
                  <span className="badge bg-danger rounded-circle p-3 cursor-pointer" onClick={() => handleMatch(_id)}>
                    <FaHeart className="fs-28" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No profiles match the selected filters.</p>
          )}
        </div>

        <div className="col-12 col-md-4 mb-4">
          <h5 className="mb-4 fw-bold">Filter your search!</h5>
          {[
            { label: "Gender", name: "gender", options: ["Male", "Female", "Others"] },
            { label: "Age Range", name: "ageRange", options: ["18-25", "26-35", "36-45", "46+"] },
            { label: "Location", name: "country", options: ["New York", "Los Angeles", "Chicago", "Others"] },
            { label: "Religion", name: "religion", options: ["Christianity", "Islam", "Hinduism", "Atheism", "Others"] },
            { label: "Education", name: "education", options: ["High School", "Bachelor's Degree", "Master's Degree", "Others"] },
            { label: "Profession", name: "profession", options: ["Engineer", "Doctor", "Artist", "Entrepreneur", "Architect", "Others"] },
          ].map(({ label, name, options }) => (
            <div className="mb-3" key={name}>
              <label className="form-label">{label}</label>
              <select className="form-select" name={name} value={filters[name]} onChange={handleChange}>
                <option value="">Select Here</option>
                {options.map((option) => (
                  <option key={option} value={option.toLowerCase()}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
