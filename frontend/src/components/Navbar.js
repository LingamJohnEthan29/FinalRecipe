import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { faHome, faList, faCog, faMagic } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
    const [showSidebar, setShowSidebar] = useState(false);
    const location = useLocation();
    const links = [
        {
            name: "Home",
            path: "/",
            icon: faHome
        },
        {
            name: "Cuisines",
            path: "/cuisines",
            icon: faCog
        },
        {
            name: "Recipes",
            path: "/recipes",
            icon: faList
        },
        {
            name: "Recipe Generator", // New link
            path: "/recipe-generator",
            icon: faMagic
        }
    ];

    function closeSidebar() {
        setShowSidebar(false);
    }

    return (
        <>
            <div className="navbar container">
                <Link to="/" className="logo"><span>Online</span>Recipe</Link>
                <div className="nav-links">
                    {links.map(link => (
                        <Link className={location.pathname === link.path ? "active" : ""} to={link.path} key={link.name}>
                            {link.name}
                        </Link>
                    ))}
                </div>
                <div onClick={() => setShowSidebar(true)} className={showSidebar ? "sidebar-btn active" : "sidebar-btn"}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
            </div>
            {showSidebar && <Sidebar close={closeSidebar} links={links} />}
        </>
    );
}
