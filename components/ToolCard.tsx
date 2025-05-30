import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, Button, Form } from "react-bootstrap";

interface Review {
  id: string;
  toolId: string;
  userId: string;
  username: string;
  comment: string;
  rating: number;
  timestamp: string;
}

interface ToolCardProps {
  toolId: string;
  name: string;
  description: string;
  categories?: string[];
  pricing?: string;
  website?: string;
  submittedBy?: string;
  dateSubmitted?: string;
  thumbnail?: string;
  averageRating?: number;
  userId?: string;
  username?: string;
  onDelete: (toolId: string) => void;
}

export default function ToolCard({
  toolId,
  name,
  description,
  categories = [],
  pricing,
  website,
  submittedBy,
  dateSubmitted,
  thumbnail,
  averageRating = 0,
  userId,
  username,
  onDelete,
}: ToolCardProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [favicon, setFavicon] = useState<string | null>(null);
  const [metaDescription, setMetaDescription] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(`/api/getReviews?toolId=${toolId}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
    fetchReviews();
  }, [toolId]);

  useEffect(() => {
    if (!website) return;
    const domain = new URL(website).hostname;
    setFavicon(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`);

    fetch(`https://jsonlink.io/api/extract?url=${website}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.description) setMetaDescription(data.description);
      })
      .catch((err) => console.warn("Meta fetch failed:", err));
  }, [website]);

  const overallAverageRating = averageRating ?? 0;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide a rating and a comment.");
      return;
    }

    const newReview: Review = {
      id: `review-${Date.now()}`,
      toolId,
      userId: userId || "guest",
      username: username || "Anonymous",
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

      if (!response.ok) throw new Error("Failed to submit review");

      setReviews((prevReviews) => [...prevReviews, newReview]);
      setShowReviewForm(false);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review. Please try again.");
    }
  };

  return (
    <Card className="mb-4 shadow">
      <Card.Body>
        <div className="d-flex align-items-center">
          <Image
            src={favicon || thumbnail || "/placeholder.svg"}
            alt={name}
            width={64}
            height={64}
            className="rounded-circle me-3"
          />
          <div>
            <Card.Title>{name}</Card.Title>
            <Card.Subtitle className="text-muted">
              {categories.length > 0 ? categories.join(", ") : "No categories"}
            </Card.Subtitle>
          </div>
        </div>

        <Card.Text className="mt-3">{description}</Card.Text>
        {metaDescription && (
          <p className="text-muted small mb-2">🌐 {metaDescription}</p>
        )}
        <p className="text-muted small">
          Submitted by {submittedBy || "Unknown"} on {dateSubmitted || "Unknown"}
        </p>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge bg-primary">{pricing || "N/A"}</span>
          <div>
            <span className="me-2">Rating:</span>
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`fs-5 ${i < overallAverageRating ? "text-warning" : "text-secondary"}`}
              >
                ★
              </span>
            ))}
            <span className="ms-2">
              {overallAverageRating > 0
                ? `(${overallAverageRating.toFixed(1)})`
                : "(No ratings yet)"}
            </span>
          </div>
        </div>

        <div className="d-flex justify-content-between mb-3">
          <Button variant="primary" href={website} target="_blank">
            Visit Website
          </Button>
          <Button variant="warning" onClick={() => router.push(`/tool/${toolId}/edit`)}>
            ✏️ Edit
          </Button>
          <Button variant="danger" onClick={() => onDelete(toolId)} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "🗑️ Delete"}
          </Button>
        </div>

        <div className="d-flex gap-3 mb-3">
          <Button
            variant="outline-secondary"
            onClick={() => setShowReviews(!showReviews)}
          >
            {showReviews ? "🔽 Hide Reviews" : "🗨️ Show Reviews"}
          </Button>

          <Button
            variant="success"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </Button>
        </div>

        {showReviews && (
          <>
            <h5>Reviews</h5>
            {reviews.length === 0 ? (
              <p>No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border p-2 my-2 rounded">
                  <strong>{review.username}</strong>
                  <span className="text-warning ms-2">{'★'.repeat(review.rating)}</span>
                  <p>{review.comment}</p>
                </div>
              ))
            )}
          </>
        )}

        {showReviewForm && (
          <Form onSubmit={handleSubmitReview} className="mt-3 p-3 border rounded">
            <Form.Group>
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
            <Form.Group className="mt-2">
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="mt-2" variant="primary">
              Submit Review
            </Button>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
}
