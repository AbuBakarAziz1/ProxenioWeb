"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function UserLayout({ children }) {
    const { data: session, status } = useSession(); // Always call hooks at the top
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        const closeSidebar = (e) => {
            if (isSidebarOpen && !e.target.closest(".sidebar") && !e.target.closest(".toggle-btn")) {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener("click", closeSidebar);
        return () => document.removeEventListener("click", closeSidebar);
    }, [isSidebarOpen]);

    useEffect(() => {
        setIsSidebarOpen(false); // Close sidebar on route change
    }, [pathname]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleLogout = async () => signOut({ callbackUrl: "/login" });

    if (status === "loading") {
        return <div>Loading...</div>; // Render after all hooks have run
    }

    const user = session?.user || {};

    return (
        <>
            {/* Sidebar Toggle Button */}
            <button className="toggle-btn" onClick={toggleSidebar}>
                <i className="bi bi-list"></i>
            </button>

            {/* Sidebar */}
            <div className={`sidebar border-end ${isSidebarOpen ? "show" : "hide"}`}>
                <div className="d-flex align-items-center mb-4">
                    <Image src="/assets/img/LogoProxenio.png" width={45} height={45} alt="Logo" />
                    <Link className="ps-1 fs-5 fw-medium color-maroon text-decoration-none" href="/user">
                        Proxenio
                    </Link>
                </div>

                <div className="sidebar-menu d-flex flex-column">
                    <SidebarLink href="/user/explore" icon="bi-grid-1x2" label="Explore Profile" pathname={pathname} setIsSidebarOpen={setIsSidebarOpen} />
                    <SidebarLink href="/user/myprofile" icon="bi-heart" label="My Profile" pathname={pathname} setIsSidebarOpen={setIsSidebarOpen} />
                    <SidebarLink href="/user/matches" icon="bi-people" label="My Matches" pathname={pathname} setIsSidebarOpen={setIsSidebarOpen} />
                    <SidebarLink href="/user/settings" icon="bi-gear" label="Settings" pathname={pathname} setIsSidebarOpen={setIsSidebarOpen} />
                    
                    {/* Logout Button */}
                    <a onClick={handleLogout} className="menu-item">
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                    </a>
                </div>
            </div>

            {/* Main Content */}
            <div className="content">
                <main>
                    <div className="row align-items-center mb-4 mt-1">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center fs-4 px-0">
                                <span>Good Morning, <strong>{user?.fullName || "Guest"}</strong></span>
                            </div>
                        </div>
                        <div className="col-md-6 d-none d-md-flex justify-content-end align-items-center">
                            <Image src={user?.profilePicture || "/assets/img/user.png"} width={50} height={50} className="rounded-pill border me-3" alt="User" />
                            <div className="text-start me-5">
                                <h5 className="mb-0 text-muted">{user?.username || "Guest"}</h5>
                                <p className="mb-0 text-muted">{user?.email || "No Email"}</p>
                            </div>

                            {/* Language Selector */}
                            <ul className="navbar-nav bg-light ms-5">
                                <li className="nav-item dropdown">
                                    <a className="nav-link bg-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="bi bi-globe-americas fs-3"></i>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><a className="dropdown-item" href="#">English</a></li>
                                        <li><a className="dropdown-item" href="#">Greek</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {children}
                </main>
            </div>
        </>
    );
}

// Sidebar Link Component
function SidebarLink({ href, icon, label, pathname, setIsSidebarOpen }) {
    return (
        <Link href={href} className={`menu-item ${pathname === href ? "active" : ""}`} onClick={() => setIsSidebarOpen(false)}>
            <i className={`bi ${icon}`}></i>
            <span>{label}</span>
        </Link>
    );
}
