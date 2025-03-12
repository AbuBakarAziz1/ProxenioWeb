"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSession, signOut } from "next-auth/react";

export default function DashboardLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [greeting, setGreeting] = useState("");

    const user = session?.user || {};

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
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
        setIsSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        const hour = new Date().getHours();
        setGreeting(hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening");
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleLogout = () => signOut({ callbackUrl: "/login" });

    if (status === "loading") return <div>Loading...</div>;

    // Extract path segments & remove IDs (assume IDs are last & 24-char long)
    const pathSegments = pathname
        .split("/")
        .filter((segment) => segment && segment !== "admin" && !/^[a-fA-F0-9]{24}$/.test(segment));

    return (
        <>
            {/* Sidebar Toggle */}
            <button className="toggle-btn" onClick={toggleSidebar}>
                <i className="bi bi-list"></i>
            </button>

            {/* Sidebar */}
            <div className={`sidebar border-end ${isSidebarOpen ? "show" : "hide"}`}>
                <div className="d-flex align-items-center mb-4">
                    <Image src="/assets/img/LogoProxenio.png" width={45} height={45} alt="Logo" />
                    <Link href="/user" className="ps-1 fs-5 fw-medium color-maroon text-decoration-none">
                        Proxenio
                    </Link>
                </div>
                <div className="sidebar-menu d-flex flex-column">
                    <SidebarLink href="/admin" icon="bi-house-door" label="Dashboard" pathname={pathname} />
                    <SidebarLink href="/admin/users" icon="bi-people" label="Users" pathname={pathname} />
                    <SidebarLink href="/admin/matches" icon="bi-heart" label="Matches" pathname={pathname} />
                    <SidebarLink href="/admin/payments" icon="bi-currency-dollar" label="Payments" pathname={pathname} />
                    <SidebarLink href="/admin/content" icon="bi-file-text" label="Content" pathname={pathname} />
                    <SidebarLink href="/admin/profile" icon="bi-person" label="Profile" pathname={pathname} />
                    <SidebarLink href="/admin/setting" icon="bi-gear" label="Settings" pathname={pathname} />
                    <SidebarLink href="/admin/roles" icon="bi-person-gear" label="Roles" pathname={pathname} />
                    <a onClick={handleLogout} className="menu-item cursor-pointer">
                        <i className="bi bi-box-arrow-right"></i> <span>Logout</span>
                    </a>
                </div>
            </div>

            {/* Main Content */}
            <div className="content">
                <main>
                    <div className="row align-items-center mb-5">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center fs-4">
                                {pathname === "/admin" ? (
                                    <span className="fw-semibold text-capitalize">
                                        {greeting}, <strong>{user?.fullName || "Guest"}</strong>
                                    </span>
                                ) : (
                                    <Breadcrumb pathSegments={pathSegments} />
                                )}
                            </div>
                        </div>
                        <div className="col-md-6 d-none d-md-flex justify-content-end align-items-center">
                            <Image
                                src={user?.profilePicture || "/assets/img/user.png"}
                                width={50}
                                height={50}
                                className="rounded-pill border me-3"
                                alt="User"
                            />
                            <div className="text-start me-5">
                                <h5 className="mb-0 text-muted">{user?.username || "Guest"}</h5>
                                <p className="mb-0 text-muted">{user?.email || "No Email"}</p>
                            </div>
                            <LanguageDropdown />
                        </div>
                    </div>
                    {children}
                </main>
            </div>
        </>
    );
}

// Breadcrumb Navigation Component
function Breadcrumb({ pathSegments }) {
    return (
        <nav>
            <Link href="/admin" className="text-muted text-decoration-none">Admin</Link> {" >> "}
            {pathSegments.map((segment, index) => {
                const href = `/admin/${pathSegments.slice(0, index + 1).join("/")}`;
                return (
                    <span key={index}>
                        <Link href={href} className="text-capitalize text-decoration-none text-muted">
                            {segment.replace(/-/g, " ")}
                        </Link>
                        {index < pathSegments.length - 1 && " > "}
                    </span>
                );
            })}
        </nav>
    );
}

// Sidebar Link Component
function SidebarLink({ href, icon, label, pathname }) {
    return (
        <Link href={href} className={`menu-item ${pathname === href ? "active" : ""}`}>
            <i className={`bi ${icon}`}></i> <span>{label}</span>
        </Link>
    );
}

// Language Dropdown Component
function LanguageDropdown() {
    return (
        <ul className="navbar-nav bg-light ms-5">
            <li className="nav-item dropdown">
                <a className="nav-link bg-white" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-globe-americas fs-3"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" href="#!">English</a></li>
                    <li><a className="dropdown-item" href="#!">Greek</a></li>
                </ul>
            </li>
        </ul>
    );
}
