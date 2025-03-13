"use client";
import { MdError } from "react-icons/md";

export default function Verification() {


    return (
        <div className="container px-2 mt-3">
            <div className="d-flex justify-content-center align-items-center mt-5">
                <div className=" border-0 p-4 text-center">
                    <MdError className="color-maroon fs-25 my-3" fontSize={96} />
                    <h3 className="mb-3">Your account is not verified yet.</h3>
                    <p>Your account is under review, please wait. We will notify you once it’s approved by the admin.
                        <br /> Thanks for your patience.</p>
                </div>
            </div>
        </div>
    );
}