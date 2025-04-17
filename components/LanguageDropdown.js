"use client";

import { useRouter, usePathname } from "next/navigation";

export default function LanguageDropdown() {
    const router = useRouter();
    const pathname = usePathname();

    const changeLanguage = (locale) => {
        const newPath = `/${locale}${pathname.replace(/^\/(en|el)/, "")}`;
        router.push(newPath);
    };

    return (
        <ul className="navbar-nav bg-light ms-5">
            <li className="nav-item dropdown">
                <a className="nav-link bg-white" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-globe-americas fs-3"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" onClick={() => changeLanguage("en")}>English</a></li>
                    <li><a className="dropdown-item" onClick={() => changeLanguage("el")}>Ελληνικά</a></li>
                </ul>
            </li>
        </ul>
    );
}
