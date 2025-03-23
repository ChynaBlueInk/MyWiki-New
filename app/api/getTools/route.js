export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import AWS from "aws-sdk";

AWS.config.update({ region: "ap-southeast-2" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TOOLS_TABLE = "MyWikiTools";
const REVIEWS_TABLE = "Reviews";

export async function GET() {
  try {
    console.log("📡 Fetching tools from AWS DynamoDB...");

    const toolsParams = { TableName: TOOLS_TABLE };
    const toolsData = await dynamoDB.scan(toolsParams).promise();
    let tools = toolsData.Items || [];

    if (!Array.isArray(tools)) {
      console.warn("⚠️ Tools data is not an array:", tools);
      tools = [];
    }

    console.log(`✅ Tools retrieved: ${tools.length}`);

    console.log("📡 Fetching reviews from AWS DynamoDB...");
    const reviewsParams = { TableName: REVIEWS_TABLE };
    const reviewsData = await dynamoDB.scan(reviewsParams).promise();
    const reviews = reviewsData.Items || [];

    console.log(`✅ Reviews retrieved: ${reviews.length}`);

    const toolRatings = {};
    reviews.forEach((review) => {
      if (review.toolId && typeof review.rating === "number") {
        if (!toolRatings[review.toolId]) {
          toolRatings[review.toolId] = { totalRating: 0, count: 0 };
        }
        toolRatings[review.toolId].totalRating += review.rating;
        toolRatings[review.toolId].count += 1;
      }
    });

    tools = tools.map((tool) => {
      const ratingData = toolRatings[tool.toolId];
      const averageRating = ratingData
        ? (ratingData.totalRating / ratingData.count).toFixed(1)
        : 0;

      return {
        ...tool,
        averageRating: Number(averageRating),
      };
    });

    const sortedTools = tools.sort(
      (a, b) =>
        new Date(b.dateSubmitted ?? b.createdAt ?? 0).getTime() -
        new Date(a.dateSubmitted ?? a.createdAt ?? 0).getTime()
    );

    console.log(`✅ Final Tools: ${sortedTools.length}`);
    return NextResponse.json(sortedTools, { status: 200 });

  } catch (error) {
    console.error("❌ API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch tools", details: error.message },
      { status: 500 }
    );
  }
}
