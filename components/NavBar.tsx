import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo">AI Tools Wiki</h1>
        <ul className="nav-links">
        <li><Link href="/add-tool">Add Tool</Link></li>
        <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/tools">Tools</Link></li>
          <li><Link href="/categories">Categories</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/search">Search</Link></li>
        </ul>
      </div>
    </nav>
  );
}
