"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function UserDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ matches: [] });

  useEffect(() => {
    if (!id) return;

    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`/api/getUserByid/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user details");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchUserMatches = async () => {
      try {
        const res = await fetch(`/api/getMatches?userId=${id}`);
        if (!res.ok) throw new Error("Failed to fetch matches");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUserDetails();
    fetchUserMatches();
  }, [id]);

  if (error) return <p className="text-center text-danger mt-3">{error}</p>;
  if (!user) return <p className="text-center mt-3">User not found.</p>;

  return (
    <div className="row">
      <div className="col-md-12">
        
        <div className="card shadow-sm p-3 border-0">
          <div className="d-flex align-items-center mb-3">
            <Image
              src={user.profilePicture?.trim() ? user.profilePicture : "/assets/img/user.png"}
              width={120}
              height={120}
              className="rounded-circle border border-secondary object-fit-cover"
              alt={user.username || "User"}
            />
            <div className="ms-3">
              <h5 className="mb-0 text-black">{user?.fullName || "Username"}</h5>
              <p className="mb-0 text-muted">{user?.email || "No email available"}</p>
            </div>
          </div>

          {/* User Information Table */}
          <div className="table-responsive rounded-4">
            <table className="table tablespace text-start table-light rounded-4">
              <tbody className="text-grayer tbody-bg">
                {[
                  ["UserId", user._id, "Gender", user.gender],
                  ["Age", user.age, "Location", `${user.city}, ${user.country}`],
                  ["Phone Number", user.phone, "Member Status", user.status],
                  ["No. of Hearts Received", user.heartsReceived.length, "No. of Hearts Sent", user.heartsSent.length],
                ].map(([label1, value1, label2, value2], index) => (
                  <tr key={index}>
                    <td>{label1}</td>
                    <td className="text-black">{value1 || "N/A"}</td>
                    <td>{label2}</td>
                    <td className="text-black">{value2 || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Matches Details */}
      <div className="col-md-12 mt-4">
        <h5 className="fw-semibold fs-24">Matches Details</h5>

        <div className="table-responsive bg-fff p-2 rounded-4">
          <table className="table tablespace text-center">
            <thead className="thead-bg">
              <tr>
                <th></th>
                <th>User ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-grayer tbody-bg">
              {data.matches.length > 0 ? (
                data.matches.map(({ _id, profilePicture, username, fullName, country, phone, status }) => (
                  <tr key={_id}>
                    <td>
                      <input type="checkbox" className="form-check-input" />
                    </td>
                    <td>{_id}</td>
                    <td>
                      <Image
                        src={profilePicture?.trim() ? profilePicture : "/assets/img/user.png"}
                        width={50}
                        height={50}
                        className="rounded-circle object-fit-cover"
                        alt={username || "User"}
                      />
                    </td>
                    <td>{fullName || "N/A"}</td>
                    <td>{country || "N/A"}</td>
                    <td>{phone || "N/A"}</td>
                    <td>
                      <button className={`btn rounded-pill text-capitalize ${status === "active" ? "bg-green-btn" : "bg-light-btn"}`}>
                        {status}
                      </button>
                    </td>
                    <td></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    No matches found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
