import React from "react";
import Link from "next/link";
import "../styles/global.css"; // Ensure global styles are applied

const NavBar = () => {
  return (
    <nav className="navbar">
      {/* ✅ Logo on the left */}
      <div className="nav-logo">
        <img src="/logo.png" alt="AI Tools Wiki Logo" />
      </div>
      {/* ✅ Navigation Links */}
      <ul className="nav-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/tools">Tools</Link></li>
        <li><Link href="/add-tool">Add Tool</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
