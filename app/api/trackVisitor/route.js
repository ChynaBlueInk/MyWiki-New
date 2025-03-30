import { NextResponse } from "next/server";
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "ap-southeast-2"
});

const TABLE_NAME = "VisitorStats";

export async function GET() {
  const key = { id: "counter" };

  try {
    // Get current count
    const data = await dynamoDb.get({
      TableName: TABLE_NAME,
      Key: key
    }).promise();

    let count = (data.Item?.count || 0) + 1;

    // Update count
    await dynamoDb.put({
      TableName: TABLE_NAME,
      Item: {
        ...key,
        count
      }
    }).promise();

    return NextResponse.json({ count });
  } catch (error) {
    console.error("❌ Error tracking visitor:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
