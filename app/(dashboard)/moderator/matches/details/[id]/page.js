"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function MatchDetail() {
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchMatchDetails = async () => {
            try {
                const res = await fetch(`/api/getMatchesByMatchId?matchId=${id}`);
                if (!res.ok) throw new Error("Failed to fetch match details");
                
                const result = await res.json();
                setMatch(result);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMatchDetails();
    }, [id]);

    if (error) return <p className="text-center text-danger mt-3">{error}</p>;
    if (!match) return <p className="text-center mt-3">No match found.</p>;

    const { sender, receiver } = match;

    // Helper function to ensure correct row formatting
    const renderTableRow = (label, value) => (
        value ? (
            <tr>
                <td>{label}</td>
                <td className="text-black">{value}</td>
            </tr>
        ) : null
    );

    return (
        <div className="row">
            {/* Sender Card */}
            <div className="col-md-6">
                <div className="card shadow-sm p-3 border-0">
                
                    <div className=" mb-3">
                        <Image
                            src={sender.profilePicture?.trim() ? sender.profilePicture : "/assets/img/user.png"}
                            width={120}
                            height={120}
                            className="rounded-circle border border-secondary object-fit-cover ms-2"
                            alt={sender.username || "User"}
                        />
                        <div className="m-2">
                            <h5 className="mb-0 text-black">{sender.fullName || "Username"}</h5>
                            <p className="mb-0 text-muted">{sender.email || "No email available"}</p>
                        </div>
                    </div>
                    <div className="table-responsive rounded-4">
                        <table className="table tablespace text-start table-light rounded-4">
                            <tbody className="text-grayer tbody-bg">
                                {renderTableRow("User ID", sender._id)}
                                {renderTableRow("Gender", sender.gender)}
                                {renderTableRow("Age", sender.age)}
                                {renderTableRow("Location", sender.city && sender.country ? `${sender.city}, ${sender.country}` : null)}
                                {renderTableRow("Phone Number", sender.phone)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Receiver Card */}
            <div className="col-md-6">
                <div className="card shadow-sm p-3 border-0">
            
                    <div className=" mb-3">
                        <Image
                            src={receiver.profilePicture?.trim() ? receiver.profilePicture : "/assets/img/user.png"}
                            width={120}
                            height={120}
                            className="rounded-circle border border-secondary object-fit-cover ms-2"
                            alt={receiver.username || "User"}
                        />
                        <div className="m-2">
                            <h5 className="mb-0 text-black">{receiver.fullName || "Username"}</h5>
                            <p className="mb-0 text-muted">{receiver.email || "No email available"}</p>
                        </div>
                    </div>
                    <div className="table-responsive rounded-4">
                        <table className="table tablespace text-start table-light rounded-4">
                            <tbody className="text-grayer tbody-bg">
                                {renderTableRow("User ID", receiver._id)}
                                {renderTableRow("Gender", receiver.gender)}
                                {renderTableRow("Age", receiver.age)}
                                {renderTableRow("Location", receiver.city && receiver.country ? `${receiver.city}, ${receiver.country}` : null)}
                                {renderTableRow("Phone Number", receiver.phone)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
