"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { showSuccess, showError } from "@/components/ToastAlert";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession(); // Get session data
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        showError("Invalid credentials");
        setLoading(false);
        return;
      }

      showSuccess("Successfully Logged In!");
      setLoading(false);

      // **Wait for session to update**
      setTimeout(() => {
        if (session?.user?.role === "admin") {
          router.push("/admin");
        } else if (session?.user?.role === "moderator") {
          router.push("/moderator");
        } else {
          router.push("/user");
        }
      }, 400);

    } catch (error) {
      showError("Something went wrong. Please try again.");
      console.error("Login Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center align-items-center">


          <div className="col-lg-4 text-center">
            <Image src="/assets/img/LogoProxenio.png" alt="Logo" className="img-fluid" style={{ maxWidth: "100%", maxHeight: "200px" }} />
            <h3 className="color-maroon mt-3 fs-40 fw-semibold">Proxenio</h3>
            <p className="color-maroon mt-1 fs-24">Find True Love with <br /> Proxenio.net</p>
          </div>

          <div className="col-lg-5">
            <div className="card border-0 rounded-5 p-5 p-lg-7 shadow">
              <h3 className="text-left font-weight-light my-2">Sign In</h3>
              <form onSubmit={handleLogin}>

                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                  <label>Email address</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                  <label>Password</label>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                  <Link href="/forgot-password" className="small text-maroon">Forgot Password?</Link>
                  <button className="btn bg-maroon text-white px-5" type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
