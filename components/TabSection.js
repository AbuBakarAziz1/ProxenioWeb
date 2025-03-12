"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const TabSection = ({ userId }) => {
    const [activeTab, setActiveTab] = useState("hearts-sent");
    const [data, setData] = useState({ sentHearts: [], receivedHearts: [], matches: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/getMatches?userId=${userId}`);
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Error fetching data");
                setData(result);
                setError(null);
            } catch (err) {
                setError(err.message || "Server error. Try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const tabs = [
        { id: "hearts-sent", title: "Hearts Sent", dataKey: "sentHearts" },
        { id: "hearts-received", title: "Hearts Received", dataKey: "receivedHearts" },
        { id: "matches-made", title: "Matches Made", dataKey: "matches" },
    ];
    return (
        <div className="row">
            <div className="col-md-12">
                <ul className="nav" role="tablist">
                    {tabs.map(({ id, title }) => (
                        <li className="nav-item" key={id}>
                            <button
                                className={`nav-link ${activeTab === id ? "color-maroon active" : "text-black"}`}
                                onClick={() => setActiveTab(id)} >
                                {title}
                            </button>
                        </li>
                    ))}
                </ul>

                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-center text-danger">{error}</p>}

                {!loading && !error && (
                    <div className="tab-content pt-3">
                        {tabs.map(({ id, dataKey }) => (
                            <div key={id} className={`tab-pane fade ${activeTab === id ? "show active" : ""}`}>
                                <div className="row g-3">
                                    {data[dataKey]?.length > 0 ? (
                                        data[dataKey].map(({ _id, profilePicture, fullName, aboutMe, country }) => (
                                            <div className="col-md-4" key={_id}>
                                                <div className="profile-card position-relative rounded-3 border-0 shadow-sm overflow-hidden">
                                                    {/* Full Image */}
                                                    <Image
                                                        src={profilePicture || "/assets/img/bg01.png"}
                                                        className="object-fit img-fluid"
                                                        width={100}
                                                        height={100}
                                                        alt={fullName}
                                                        style={{ width: "100%", height: "300px", objectFit: "cover" }} />

                                                    {/* Overlay effect */}
                                                    <div className="profile-card-overlay position-absolute bottom-0 start-0 w-100 p-3"
                                                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                                                        <h5 className="text-white mb-1">{fullName}</h5>
                                                        <p className="text-white small">{aboutMe || "No description available."}</p>
                                                        <div className="d-flex gap-2">
                                                            <span className="badge rounded-pill text-bg-light px-3 py-2">
                                                                <i className="bi bi-geo-alt-fill"></i> {country || "Unknown"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-muted">No data available.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TabSection;
