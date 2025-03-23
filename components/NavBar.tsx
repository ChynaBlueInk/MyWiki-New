"use client";

import React from "react";
import Link from "next/link";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../styles/global.css";

const NavBar = () => {
  return (
    <Navbar
      expand="lg"
      bg="light"
      variant="light"
      sticky="top"
      style={{ zIndex: 999, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
    >
      <Container>
        {/* ✅ Logo on the left */}
        <Navbar.Brand as={Link} href="/">
          <img
            src="/logo.png"
            alt="AI Tools Wiki Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
        </Navbar.Brand>

        {/* ✅ Hamburger toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* ✅ Collapsible Nav Items */}
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="bg-white p-3 rounded shadow-sm"
        >
          <Nav className="ms-auto">
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
