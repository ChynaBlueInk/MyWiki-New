"use client";

import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="navbar">
      <Link href="/">Home</Link>
      <Link href="/tools">Tools</Link>
      <Link href="/add-tool">Add Tool</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>

      {/* Authentication temporarily removed */}
      {/* 
      <Link href="/signup">
        <button>Sign Up</button>
      </Link>
      <Link href="/login">
        <button>Login</button>
      </Link>
      */}
    </nav>
  );
};

export default NavBar;
