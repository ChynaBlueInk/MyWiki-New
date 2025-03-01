import { useState } from "react";
import Image from "next/image";
import { Card, Button } from "react-bootstrap";
import ReviewForm from "./ReviewForm";

interface Review {
  id: string;
  user: string;
  comment: string;
  rating: number;
}

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  categories: string[];
  pricing: string;
  website: string;
  submittedBy: string;
  dateSubmitted: string;
  thumbnail: string;
  averageRating: number;
  reviews: Review[];
}

export default function ToolCard({
  id,
  name,
  description,
  categories,
  pricing,
  website,
  submittedBy,
  dateSubmitted,
  thumbnail,
  averageRating,
  reviews,
}: ToolCardProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <Card className="mb-4 shadow">
      <Card.Body>
        <div className="d-flex align-items-center">
          <Image
            src={thumbnail || "/placeholder.svg"}
            alt={name}
            width={64}
            height={64}
            className="rounded-circle me-3"
          />
          <div>
            <Card.Title>{name}</Card.Title>
            <Card.Subtitle className="text-muted">{categories.join(", ")}</Card.Subtitle>
          </div>
        </div>

        <Card.Text className="mt-3">{description}</Card.Text>
        <p className="text-muted small">Submitted by {submittedBy} on {dateSubmitted}</p>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge bg-primary">{pricing}</span>
          <div>
            <span className="me-2">Rating:</span>
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={`fs-5 ${i < averageRating ? "text-warning" : "text-secondary"}`}>
                ★
              </span>
            ))}
            <span className="ms-2">({averageRating.toFixed(1)})</span>
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <Button variant="primary" href={website} target="_blank">
            Visit Website
          </Button>
          <Button variant="outline-secondary" onClick={() => setShowReviewForm(!showReviewForm)}>
            {showReviewForm ? "Hide Review Form" : "Write a Review"}
          </Button>
        </div>

        {showReviewForm && <ReviewForm toolId={id} />}

        <div className="mt-4">
          <h5>Reviews</h5>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="p-2 border rounded my-2">
                <strong>{review.user}</strong>
                <div className="mb-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={`fs-6 ${i < review.rating ? "text-warning" : "text-secondary"}`}>
                      ★
                    </span>
                  ))}
                </div>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-muted">No reviews yet.</p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
