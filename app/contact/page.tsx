"use client";

import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    // ✅ Add subject to emails for easy filtering
    formData.append("_subject", "My AI Wiki Contact Request");

    try {
      await fetch("https://formsubmit.co/chynablueink@gmail.com", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      setSubmitted(true);
      form.reset();
    } catch (error: any) {
      console.error("❌ Error submitting contact form:", error);
      alert("❌ There was an error sending your message. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Contact Us</h1>
      <p>Have a question or want to suggest a tool? Get in touch below.  If the form is not working, email <b>chynablueink@gmail.com</b> with your ideas.</p>

      {submitted ? (
        <Alert variant="success" className="mt-4">
          ✅ Thank you for your message! If you left an email address, someone will be in touch as soon as possible.
        </Alert>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Your Name</Form.Label>
            <Form.Control type="text" name="name" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Your Email (optional)</Form.Label>
            <Form.Control type="email" name="email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="message">
            <Form.Label>Message</Form.Label>
            <Form.Control as="textarea" name="message" rows={4} required />
          </Form.Group>

          <Button type="submit" variant="primary">
            Send Message
          </Button>
        </Form>
      )}
    </div>
  );
}
