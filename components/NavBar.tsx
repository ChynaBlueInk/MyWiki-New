"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../styles/global.css";

const NavBar = () => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(!expanded);
  const handleClose = () => setExpanded(false);
  return (
    <Navbar
      expand="lg"
      style={{
        backgroundColor: "#002244", // Dark blue
        zIndex: 999,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
      variant="dark"
      sticky="top"
      expanded={expanded}
      onToggle={handleToggle}
    >
      <Container>
        {/* ✅ Logo + Text */}
        <Navbar.Brand as={Link} href="/" className="d-flex align-items-center">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <span style={{ fontWeight: "bold", color: "white", fontSize: "1.2rem" }}>
            AI Tools Wiki
          </span>
        </Navbar.Brand>

        {/* ✅ Hamburger toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* ✅ Collapsible Nav Items */}
        <Navbar.Collapse
  id="basic-navbar-nav"
  className="p-3"
  style={{ backgroundColor: "#002244" }}
>
          <Nav className="ms-auto" onClick={handleClose}>
            <Nav.Link as={Link} href="/" className="mx-2">
              Home
            </Nav.Link>
            <Nav.Link as={Link} href="/tools" className="mx-2">
              Tools
            </Nav.Link>
            <Nav.Link as={Link} href="/add-tool" className="mx-2">
              Add Tool
            </Nav.Link>
            <Nav.Link as={Link} href="/about" className="mx-2">
              About
            </Nav.Link>
            <Nav.Link as={Link} href="/contact" className="mx-2">
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
