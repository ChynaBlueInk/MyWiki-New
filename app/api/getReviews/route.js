import { NextResponse } from "next/server";
import AWS from "aws-sdk";

AWS.config.update({ region: "ap-southeast-2" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Reviews"; // Ensure this matches your DynamoDB table name

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const toolId = searchParams.get("toolId");

    if (!toolId) {
      return NextResponse.json({ error: "Missing toolId" }, { status: 400 });
    }

    // Corrected query structure
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: "toolId = :toolId",
      ExpressionAttributeValues: { ":toolId": toolId },
    };

    const { Items } = await dynamoDB.scan(params).promise();

    return NextResponse.json(Items, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
