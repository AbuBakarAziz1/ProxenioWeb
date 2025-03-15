"use client";
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { getSession } from "next-auth/react";
import { showSuccess, showError } from "@/components/ToastAlert";
import { put } from "@vercel/blob";

export default function Content() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
        fetchUploadedVideo(session.user.id);
      }
    })();
  }, []);

  const fetchUploadedVideo = async (id) => {
    try {
      const response = await fetch(`/api/get-uploaded-video?userId=${id}`);
      const data = await response.json();
      if (data.videoUrl) setUploadedVideoUrl(data.videoUrl);
    } catch (error) {
      showError("Error fetching uploaded video");
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "video/*",
  });


  const handleUpload = async () => {
    if (!file) {
      showError("Please select a file to upload.");
      return;
    }

    if (!userId) {
      showError("User ID is required.");
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      showError("File size exceeds 50MB limit.");
      return;
    }

    setUploading(true);

    try {
      const extension = file.name.split(".").pop();
      const filename = `${userId}-${Date.now()}.${extension}`;

      // Upload directly to Vercel Blob
      const blob = await put(`videos/${filename}`, file, {
        access: "public",
        token: process.env.Prox_READ_WRITE_TOKEN, // Use frontend-safe token
      });

      if (!blob.url) throw new Error("File upload failed.");

      // Send the Blob URL to your backend to update MongoDB
      const response = await fetch("/api/save-video-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, videoUrl: blob.url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save video URL.");
      }

      setUploadedVideoUrl(blob.url);
      showSuccess("Upload successful!");
      setFile(null);
      setPreviewUrl(null);
    } catch (error) {
      showError(error.message);
    } finally {
      setUploading(false);
    }
  };



  return (
    <div className="row">
      <div className="col-md-12">
        {uploadedVideoUrl ? (
          <>
            <video controls width="100%" height={400} src={uploadedVideoUrl} />
            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-danger"
                onClick={() => { setUploadedVideoUrl(null); setFile(null); setPreviewUrl(null); }}
              >
                Replace Video
              </button>
            </div>
          </>
        ) : previewUrl ? (
          <video controls width="100%" height={400} src={previewUrl} />
        ) : (
          <div
            {...getRootProps()}
            className="dropzone card d-flex justify-content-center align-items-center bg-lightgray"
            style={{ height: "400px", border: "2px dashed lightgray", cursor: "pointer" }}
          >
            <input {...getInputProps()} />
            <p>Drag & drop a video here, or click to select one</p>
          </div>
        )}

        {previewUrl && (
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-danger" onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Video"}
            </button>
            <button className="btn btn-secondary" onClick={() => { setPreviewUrl(null); setFile(null); }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
