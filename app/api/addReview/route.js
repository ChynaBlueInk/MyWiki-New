import { NextResponse } from "next/server";
import AWS from "aws-sdk";

AWS.config.update({ region: "ap-southeast-2" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Reviews";

export async function POST(req) {
  try {
    const body = await req.json();
    const { toolId, username = "Anonymous", rating, comment } = body;

    if (!toolId || typeof rating !== "number" || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const reviewId = `review-${Date.now()}-${Math.random().toString(36).substring(2)}`;

    const item = {
      reviewId,
      toolId,
      username,
      rating,
      comment,
      timestamp: new Date().toISOString(),
    };

    const params = {
      TableName: TABLE_NAME,
      Item: item,
    };

    await dynamoDB.put(params).promise();

    return NextResponse.json({ message: "Review added successfully!", review: item }, { status: 201 });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
