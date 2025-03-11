"use client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toastStyles.css"; // Import custom styles

export default function ToastAlert() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      className="small-toast" // Custom class
    />
  );
}

export const showSuccess = (message) => {
  toast.success(message, { theme: "colored" });
};

export const showError = (message) => {
  toast.error(message, { theme: "colored" });
};
