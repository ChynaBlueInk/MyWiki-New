"use client";

import { Form, Button } from "react-bootstrap";

export default function ContactPage() {
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Contact Us</h1>
      <p>
        Have a question or want to suggest a tool? Get in touch below.
        If the form isn't working, email <b>chynablueink@gmail.com</b> directly.
      </p>

      <Form
        action="https://formspree.io/f/mjkyepvz"
        method="POST"
      >
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

        {/* Custom subject line for email */}
        <input type="hidden" name="_subject" value="My AI Wiki Contact Request" />

        {/* Redirect after submit */}
        <input type="hidden" name="_next" value="/contact/thank-you" />

        <Button type="submit" variant="primary">Send Message</Button>
      </Form>
    </div>
  );
}
