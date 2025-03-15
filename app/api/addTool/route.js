import { PutCommand } from "@aws-sdk/lib-dynamodb";
import dynamoDb from "../../../lib/dynamoClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  console.log("✅ API `/api/addTool` reached");

  try {
    const body = await req.json();
    console.log("📥 Received data:", body);

    // ✅ Only `name` is required; everything else is optional
    const { name, description, categories, website, rating } = body;
    if (!name) {
      console.log("❌ Missing required field: name");
      return Response.json({ error: "Tool name is required" }, { status: 400 });
    }

    const toolId = uuidv4();
    const params = {
      TableName: process.env.AWS_TABLE_NAME,
      Item: {
        toolId,
        name,
        description: description || "", // ✅ Default to empty string if missing
        categories: Array.isArray(categories) ? categories : [], // ✅ Ensure an array
        website: website || "", // ✅ Default to empty string if missing
        rating: rating !== undefined ? Number(rating) : null, // ✅ Default to `null` if missing
        createdAt: new Date().toISOString(),
      },
    };

    console.log("🟢 Saving to DynamoDB:", JSON.stringify(params, null, 2));

    const result = await dynamoDb.send(new PutCommand(params));
    console.log("✅ DynamoDB Save Success:", result);

    return Response.json({ message: "Tool added successfully", toolId });
  } catch (error) {
    console.error("❌ Error saving to DynamoDB:", error);
    return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
