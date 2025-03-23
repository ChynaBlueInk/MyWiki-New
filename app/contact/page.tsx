"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container mt-4">
      <h1 className="mb-3">Contact Us</h1>
      <p>Have questions or want us to add a tool for you? Fill out the form below.</p>

      {submitted ? (
        <div className="alert alert-success mt-4">
          ✅ Thanks for your message! If you left an email address, someone will be in touch as soon as possible.
        </div>
      ) : (
        <form
          action="https://formsubmit.co/chynablueink@gmail.com"
          method="POST"
          className="mt-4"
          onSubmit={() => setSubmitted(true)}
        >
          {/* ✅ Hidden config fields */}
          <input type="hidden" name="_subject" value="My AI Wiki Message" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />

          <div className="mb-3">
            <label className="form-label">Your Name</label>
            <input type="text" name="name" required className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Your Email (optional)</label>
            <input type="email" name="email" className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea name="message" rows={5} required className="form-control" />
          </div>

          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      )}
    </div>
  );
}
