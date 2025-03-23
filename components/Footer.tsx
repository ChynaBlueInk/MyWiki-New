import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-light text-center text-muted py-3 mt-auto border-top">
      <Container>
        <small>&copy; {new Date().getFullYear()} AI Tools Wiki | Made with 💡</small>
      </Container>
    </footer>
  );
};

export default Footer;
