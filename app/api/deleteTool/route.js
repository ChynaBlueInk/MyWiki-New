import { NextResponse } from "next/server";
import AWS from "aws-sdk";

// ✅ Ensure AWS SDK is configured correctly
AWS.config.update({ region: "ap-southeast-2" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.AWS_TABLE_NAME || "MyWikiTools";

export async function DELETE(req) {
  try {
    console.log("🛠️ DELETE Request Received");

    // ✅ Ensure correct request URL parsing
    const API_URL = process.env.NEXT_PUBLIC_API_URL || req.headers.get("origin") || "http://localhost:3000";
    const { searchParams } = new URL(req.url, API_URL);
        const toolId = searchParams.get("toolId");

    if (!toolId) {
      console.error("❌ ERROR: Missing Tool ID");
      return NextResponse.json({ error: "Tool ID is required" }, { status: 400 });
    }

    console.log(`🔍 Checking if tool exists: ${toolId}`);

    // ✅ Check if tool exists before deletion
    const checkParams = {
      TableName: TABLE_NAME,
      Key: { toolId },
    };

    const checkResult = await dynamoDB.get(checkParams).promise();
    console.log("🛠️ Check Result:", checkResult);

    if (!checkResult.Item) {
      console.error(`⚠️ ERROR: Tool not found in database: ${toolId}`);
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    console.log("✅ Tool found, proceeding with deletion...");

    // ✅ Delete the tool
    const deleteParams = {
      TableName: TABLE_NAME,
      Key: { toolId },
    };

    await dynamoDB.delete(deleteParams).promise();
    console.log(`✅ Tool deleted successfully: ${toolId}`);

    return NextResponse.json({ message: "Tool deleted successfully", toolId });
  } catch (error) {
    console.error("❌ ERROR Deleting Tool:", error);
    return NextResponse.json({ error: "Failed to delete tool", details: error.message }, { status: 500 });
  }
}
