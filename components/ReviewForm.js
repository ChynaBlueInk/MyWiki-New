import { useState } from "react";
import { Form, Button } from "react-bootstrap";

function ReviewForm({ toolId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting review:", { toolId, rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-4">
      <Form.Group className="mb-3">
        <Form.Label>Rating</Form.Label>
        <div className="d-flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`fs-3 ${star <= rating ? "text-warning" : "text-secondary"} cursor-pointer`}
              onClick={() => setRating(star)}
              style={{ cursor: "pointer" }}
            >
              ★
            </span>
          ))}
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="comment">Review</Form.Label>
        <Form.Control
          as="textarea"
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={3}
        />
      </Form.Group>

      <Button type="submit" variant="primary">Submit Review</Button>
    </Form>
  );
}

export default ReviewForm;
