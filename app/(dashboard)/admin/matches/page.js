"use client";
import { useState, useEffect } from "react";
import { BsFillTrash3Fill, BsEye } from "react-icons/bs";
import { Modal, Button, Form } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function MatchTable() {
  const router = useRouter();
  const [matchList, setMatchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState({});
  const [modalType, setModalType] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("/api/allMatches"); 
        const data = await response.json();
        if (data.success) {
          setMatchList(data.matches);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const toggleId = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openModal = (type, match) => {
    setModalType(type);
    setSelectedMatch(match);
    setStatus(match.status);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedMatch(null);
  };

  const handleStatusChange = async () => {
    try {
      const response = await fetch(`/api/match/${selectedMatch.matchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        setMatchList((prevMatches) =>
          prevMatches.map((match) =>
            match.matchId === selectedMatch.matchId ? { ...match, status } : match
          )
        );
        closeModal();
      }
    } catch (error) {
      console.error("Error updating match status:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/match/${selectedMatch.matchId}`, { method: "DELETE" });
      setMatchList((prevMatches) =>
        prevMatches.filter((match) => match.matchId !== selectedMatch.matchId)
      );
      closeModal();
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="table-responsive bg-white p-3 rounded-4">
          <table className="table tablespace text-center">
            <thead className="align-items-center thead-bg">
              <tr>
                <th></th>
                <th>Match ID</th>
                <th>User 1 ID</th>
                <th>User 2 ID</th>
                <th>User 1 Name</th>
                <th>User 2 Name</th>
                <th>Match Date</th>
                <th>Last Interaction</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-grayer tbody-bg">
              {matchList.map((match, index) => (
                <tr key={index}>
                  <td><input type="checkbox" className="form-check-input" /></td>
                  <td
                    onClick={() => toggleId(match.matchId)}
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                    {expandedIds[match.matchId] ? match.matchId : match.matchId.substring(0, 6) + "..."}
                  </td>
                  <td
                    onClick={() => toggleId(match.user1Id)}
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                    {expandedIds[match.user1Id] ? match.user1Id : match.user1Id.substring(0, 6) + "..."}
                  </td>
                  <td
                    onClick={() => toggleId(match.user2Id)}
                    style={{ cursor: "pointer", textDecoration: "underline"}}
                  >
                    {expandedIds[match.user2Id] ? match.user2Id : match.user2Id.substring(0, 6) + "..."}
                  </td>

                  <td>{match.user1Name}</td>
                  <td>{match.user2Name}</td>
                  <td>{match.matchDate ? new Date(match.matchDate).toLocaleDateString() : "N/A"}</td>
                  <td>{match.lastInteraction ? new Date(match.lastInteraction).toLocaleDateString() : "N/A"}</td>
                  <td className="text-center align-middle">
                    <div className="d-flex justify-content-center gap-1">

                   
                    <button className="btn btn-sm color-maroon cursor-pointer"
                      onClick={() => router.push(`/admin/matches/details/${match.matchId}`)}
                      style={{ cursor: "pointer" }}>
                        <BsEye />
                      </button>

                      {/* <button className="btn btn-sm" title="Edit" onClick={() => openModal("edit", match)} className="color-maroon cursor-pointer"
                      onClick={() => router.push(`/admin/users/details/${user._id}`)}
                      style={{ cursor: "pointer" }}>
                        <BsEye />
                      </button> */}
                      <button className="btn btn-sm" title="Delete" onClick={() => openModal("delete", match)}>
                        <BsFillTrash3Fill className="text-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal show={modalType !== null} onHide={closeModal} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>{modalType === "edit" ? "Edit Match Status" : "Confirm Delete"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "delete" ? (
            <p>Are you sure you want to delete this match?</p>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="matched">Matched</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          {modalType === "delete" ? (
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          ) : (
            <Button variant="danger" onClick={handleStatusChange}>Save Changes</Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
