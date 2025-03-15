import { NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

// ✅ Set the correct AWS region
const client = new DynamoDBClient({ region: "ap-southeast-2" });
const TABLE_NAME = "MyWikiTools"; // ✅ Ensure this matches your AWS table name

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const toolId = searchParams.get("id");

    if (!toolId) {
      console.log("❌ Missing tool ID in request.");
      return NextResponse.json({ error: "Missing tool ID" }, { status: 400 });
    }

    console.log(`📡 Fetching tool details for ID: ${toolId}`);

    const command = new GetItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ toolId: toolId }),
    });

    const { Item } = await client.send(command);

    if (!Item) {
      console.log(`❌ No tool found in DynamoDB for ID: ${toolId}`);
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    let tool = unmarshall(Item);
    console.log("✅ Tool retrieved successfully:", tool);

    // ✅ Fix: Ensure `categories` is always an array
    tool.categories = tool.categories ? tool.categories : tool.category ? [tool.category] : [];

    // ✅ Fix: Convert empty strings to `null` to prevent crashes
    tool.website = tool.website || null;
    tool.description = tool.description || null;
    tool.submittedBy = tool.submittedBy || "Unknown";

    return NextResponse.json(tool, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching tool:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
