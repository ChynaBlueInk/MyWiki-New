import { NextResponse } from "next/server";
import AWS from "aws-sdk";

AWS.config.update({ region: "ap-southeast-2" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Reviews";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("reviewId");
    const userId = searchParams.get("userId");

    if (!reviewId || !userId) {
      return NextResponse.json({ error: "Missing reviewId or userId" }, { status: 400 });
    }

    // Fetch review to confirm user ownership
    const getParams = {
      TableName: TABLE_NAME,
      Key: { reviewId },
    };

    const { Item } = await dynamoDB.get(getParams).promise();

    if (!Item) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (Item.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete review
    const deleteParams = {
      TableName: TABLE_NAME,
      Key: { reviewId },
    };

    await dynamoDB.delete(deleteParams).promise();

    return NextResponse.json({ message: "Review deleted successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
