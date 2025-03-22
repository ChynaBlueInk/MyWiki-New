"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Form } from "react-bootstrap";

export default function ToolDetailPage() {
  const { id } = useParams();
  const [tool, setTool] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [averageRating, setAverageRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch tool details on load
  useEffect(() => {
    const fetchTool = async () => {
      try {
        const res = await fetch(`/api/getTool?id=${id}`);
        const data = await res.json();
        setTool(data);
      } catch (err) {
        console.error("❌ Failed to load tool:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [id]);

  // ✅ Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/getReviews?toolId=${id}`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("❌ Failed to load reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // ✅ Recalculate averageRating whenever reviews change
  useEffect(() => {
    if (reviews.length > 0) {
      const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
      const avg = total / reviews.length;
      setAverageRating(Number(avg.toFixed(1)));
    } else {
      setAverageRating(0);
    }
  }, [reviews]);

  // ✅ Submit a review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || rating < 1) return;

    console.log("📝 Submitting review for toolId:", id); // ✅ LOG HERE

    const newReview = {
      reviewId: `temp-${Date.now()}`,
      username: "Anonymous",
      rating,
      comment,
    };

    // ✅ Optimistically add review
    setReviews((prev) => [...prev, newReview]);

    setComment("");
    setRating(0);
    setSubmitted(true);

    try {
      await fetch(`/api/addReview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: id,
          username: "Anonymous",
          rating,
          comment,
        }),
      });

      fetchReviews(); // ✅ Confirm from DB
    } catch (err) {
      console.error("❌ Review submission failed:", err);
    }
  };

  if (loading || !tool) return <p>Loading tool details...</p>;

  return (
    <div className="container mt-4">
      <h2>{tool.name}</h2>
      <p className="text-muted">{tool.categories?.join(", ")}</p>
      <p>{tool.description}</p>
      <p>
        <strong>Submitted by:</strong> {tool.submittedBy || "Unknown"}
      </p>

      <div className="mb-3">
        <strong>Rating:</strong>{" "}
        {averageRating > 0 ? (
          <>
            {"★".repeat(Math.round(averageRating)) +
              "☆".repeat(5 - Math.round(averageRating))}{" "}
            ({averageRating})
          </>
        ) : (
          "No ratings yet"
        )}
      </div>

      <a href={tool.website} target="_blank" className="btn btn-primary me-2">
        Visit Website
      </a>
      <a href={`/tool/${tool.toolId}/edit`} className="btn btn-warning me-2">
        ✏️ Edit
      </a>

      <hr />
      <h4>Reviews</h4>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((rev) => (
          <div key={rev.reviewId} className="mb-3 border rounded p-2">
            <strong>{rev.username || "Anonymous"}</strong>{" "}
            {"★".repeat(rev.rating) + "☆".repeat(5 - rev.rating)}
            <p>{rev.comment}</p>
          </div>
        ))
      )}

      <hr />
      <h5>Write a Review</h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Rating</Form.Label>
          <Form.Select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            required
          >
            <option value={0}>Select Rating</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 ? "s" : ""}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="success">
          Submit Review
        </Button>
      </Form>
    </div>
  );
}
