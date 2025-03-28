import React from "react";
import Link from "next/link";

interface CategoryCardProps {
  title: string;
  count: number;
}

const categoryIconMap: Record<string, string> = {
  "3D Objects": "ai3d.png",
  "Art Generator": "aiart.png",
  "Animation Tools": "aianimation.png",
  "Audio Generation": "aiaudio.png",
  "Business tools": "aibusiness.png",
  "ChatBot": "aichatbot.png",
  "Code tools": "aicode.png",
  "Educational tools": "aieducation.png",
  "Misc": "aimisc.png",
  "Storytelling": "aistorytelling.png",
  "Text Generator": "aitext.png",
  "Image Generator": "aiimage.png",
  "Video Generating": "aivideo.png",
  "Voice Generation": "aivoice.png",
  "App Builder": "aiapp.png",
  "Research": "airesearch.png",
};

const CategoryCard: React.FC<CategoryCardProps> = ({ title, count }) => {
  const imageFile = categoryIconMap[title] || "default.png";
  const imageUrl = `/categoryicons/${imageFile}`;

  return (
    <div className="card h-100 shadow-sm">
      <div style={{ width: "100%", height: 180, backgroundColor: "#f8f9fa" }}>
        <img
          src={imageUrl}
          alt={`${title} Icon`}
          className="card-img-top"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "1rem",
          }}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/categoryicons/default.png";
          }}
        />
      </div>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{count} tools available</p>
        <Link href={`/tools?category=${encodeURIComponent(title)}`} className="btn btn-primary">
          Show all {title} Tools
        </Link>
      </div>
    </div>
  );
};

export default CategoryCard;
