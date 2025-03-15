import { useState } from "react";
import { Form, Button } from "react-bootstrap";

function ReviewForm({ toolId, userId, username, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      alert("Please provide a rating and a comment.");
      return;
    }

    const newReview = {
      toolId,
      userId,
      username,
      rating,
      comment,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/addReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      onReviewSubmitted(newReview); // Update UI with the new review
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review. Please try again.");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-4 p-3 border rounded">
      <Form.Group className="mb-3">
        <Form.Label>Rating</Form.Label>
        <div className="d-flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`fs-3 ${star <= rating ? "text-warning" : "text-secondary"}`}
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
